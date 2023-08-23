import { Request, Response } from "express";

export function isAuthorized(opts: { hasRole: Array<'admin' | 'property_owner' | 'traveller'>, allowSameUser?: boolean }) {
   return (req: Request, res: Response, next: Function) => {
       console.log("--- isAuthorized Middleware ---");
       const { role, email, uid } = res.locals
       const { id } = req.params
       console.log('opts, id, uid',opts,id,uid);
       if (opts.allowSameUser && id && uid === id)
           return next();

       if (!role)
           return res.status(403).send({message: "Forbidden"});

       if (opts.hasRole.includes(role)) {
        console.log('role',role)
        return next();
       }
           

       return res.status(403).send({message: "Forbidden"});
   }
}