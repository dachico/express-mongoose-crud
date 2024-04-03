import raw from "../../middleware/route.async.wrapper.mjs";
import express from "express";
import log from "@ajar/marker";
import user_model from "./user.model.mjs";
import Joi from "joi";

const router = express.Router();

// parse json req.body on post routes
router.use(express.json());

// CREATES A NEW USER
// router.post("/", async (req, res,next) => {
//     try{
//       const user = await user_model.create(req.body);
//       res.status(200).json(user);
//     }catch(err){
//       next(err)
//     }
// });
const userValid = Joi.object({
  first_name: Joi.string().alphanum().required(),
  last_name: Joi.string().alphanum().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.post(
  "/",
  raw(async (req, res) => {
    log.obj(req.body, "create a user, req.body:");
    const { error, value } = userValid.validate(req.body);

    if (error) {
      //added just to make sure if its working or not raw takes care of errors
      console.log(error);
      return res.send(
        "Invalid request, must specify first_name, last_name, email, and phone number."
      );
    } else {
      const user = await user_model.create(req.body);
      res.status(200).json(user);
    }
  })
);

// GET ALL USERS
router.get(
  "/",
  raw(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // basically creates a formula that in page 3 for example will skip over the first 200 users: page(3 - 1) = 2 * limit(100) = 200.

    const users = await user_model.find().skip(skip).limit(limit);
    res.status(200).json({
      status: "success",
      results: users.length, // added to see number of users
      data: {
        users,
      },
    });
  })
);

// GETS A SINGLE USER
router.get(
  "/:id",
  raw(async (req, res) => {
    const user = await user_model.findById(req.params.id).select(`-_id 
                                        first_name 
                                        last_name 
                                        email
                                        phone`);
    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);
// UPDATES A SINGLE USER
router.put(
  "/:id",
  raw(async (req, res) => {
    const user = await user_model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json(user);
  })
);
// DELETES A USER
router.delete(
  "/:id",
  raw(async (req, res) => {
    const user = await user_model.findByIdAndRemove(req.params.id);
    res.status(200).json(user);
  })
);

export default router;
