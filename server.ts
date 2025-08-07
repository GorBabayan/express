import app from './app.ts';
import { AppDataSource } from './db/data-source';

const PORT = process.env.PORT || 5435;

AppDataSource.initialize()
    .then(() => {
        console.log("Datasource initialized");
        app.listen(PORT, () => {
            console.log("App listening on port: " + PORT);
        });
    })
    .catch((err) => {
        console.error("Error while initializing", err);
    });