import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../db/data-source";
import { User } from "../types/types"

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async(email: string, password: string, done) => {
        try {
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Password is incorrect" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user: any, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id });
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});


export default passport;