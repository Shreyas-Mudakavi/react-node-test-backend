import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/Users.js";

export const register = async (req, res, next) => {
  const name = req.body.name;
  const birthday = req.body.birthday;
  const email = req.body.email;
  const password = req.body.password;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = new User({
      name: name,
      birthday: birthday,
      email: email,
      password: hashedPassword,
    });

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      res.status(409).json({ msg: "User already exists!", status: false });
      return;
    }

    // const sameName = await User.findOne({ userName: userName });
    // if (sameName) {
    //   res.status(409).json({ msg: "Username must be unique." });
    //   return;
    // }

    const savedUser = await newUser.save();
    res.status(201).json({ status: true });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  try {
    const user = await User.findOne({ name: name });

    if (!user) {
      res
        .status(404)
        .json({ msg: "Incorrect username or password.", data: false });
      return;
    }

    const decryptedPw = await bcrypt.compare(password, user.password);
    if (!decryptedPw) {
      res
        .status(400)
        .json({ msg: "Incorrect username or password.", data: false });
      return;
    }

    const jwtToken = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET_KEY || "somesupersupersecretkey",
      { expiresIn: "3d" }
    );

    res.status(201).json({ user, data: true, token: jwtToken });
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (req, res, next) => {
  //   console.log(req.headers.authorization.split(" ")[1]);

  const accessToken = req.headers.authorization.split(" ")[1];

  try {
    if (!accessToken) {
      res.status(401).json({ msg: "Not authorized!", status: false });
      return;
    }

    const verifyToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    if (!verifyToken) {
      res.status(401).json({ msg: "Not authorized!", status: false });
      return;
    }

    res.status(200).json({ msg: "Welcome, you are authorized.", status: true });
  } catch (err) {
    next(err);
  }
};
