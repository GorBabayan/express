import express, { Request, Response } from 'express';
const app = express();
import dotoenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { pool } from './db.ts';
import { User } from './types.ts';
import { usersPostSchema, usersUpdateSchema, validate } from './validation.ts';

dotoenv.config();
app.use(express.json());
app.set('PORT', process.env.DB_PORT);


app.get('/users/:id_or_email', async (req: Request<{ id_or_email: string }>, res: Response) => {
    let { id_or_email } = req.params;

    try {
       const result = await pool.query('SELECT * FROM users WHERE id::text = $1 OR email = $1 LIMIT 1', [id_or_email]);

       if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
       }

       res.json(result.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});


app.post('/users', validate(usersPostSchema), async (req: Request<{}, {}, User>, res: Response) => {
    const { name, surname, email, meta } = req.body;
    const id = uuidv4();

    try {
        const result = await pool.query('INSERT INTO users (id, name, surname, email, meta) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, name, surname, email, meta]);

        res.status(201).json({ meta, id, name, surname, email });
    } catch(error: any) {
        if (error.code == '23505') {
            res.status(400).json({ message: "Email must be unique" });
        }
    }
   
});


app.delete('/users/:id', async (req: Request<{ id: string }>, res: Response) => {
   const { id } = req.params;

   try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found"});
        }

        res.json({ message: "User deleted", user: result.rows[0] });
   } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Database error"});
   }
});

app.patch('/users/:id', validate(usersUpdateSchema), async (req: Request<{ id: string }, {}, Partial<User>>, res: Response) => {
    const { id } = req.params;
    const update = req.body;

    if (Object.keys(update).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

    let setArray = [];
    let values = [];
    let index = 1;

    for (const [key, value] of Object.entries(update)) {
        setArray.push(`${key} = $${index++}`);
        values.push(value);
    }

    values.push(id);

    const query = `UPDATE users SET ${setArray.join(', ')} WHERE id = $${index} RETURNING *`;

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found"});
        }

        res.json(result.rows[0]);
    } catch(err: any) {
        if (err.code === '23505') {
            return res.status(404).json({ message: "Email must be unique"});
        } else {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
    }
});


app.put('/users/:id', validate(usersPostSchema), async (req: Request<{ id: string }, {},  User>, res: Response) => {
   const { id } = req.params;
   const { name, surname, email, meta } = req.body;

   try {
        const result = await pool.query(`UPDATE users SET name = $2, surname = $3, email = $4, meta = $5 WHERE id = $1 RETURNING *`, [id, name, surname, email, meta]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found"});
        }

        res.json(result.rows[0]);
   } catch(err: any) {
        if (err.code === '23505') {
            return res.status(400).json({ message: "Email must be unique"});
        } else {
            console.error(err);
            return res.status(500).json({ message: "Database error"});
        }
   }
});

app.listen(app.get('PORT'), () => {
  console.log("app listen on PORT: ", app.get('PORT'));
})