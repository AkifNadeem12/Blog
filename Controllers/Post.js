import BlogModel from "../Models/Post.js";
import RegisterModel from "../Models/PostRegisterInfo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let Create;

export const postData = async (req, res) => {
  const body = req.body;
  Create = BlogModel(body);
  try {
    console.log(req.body);
    await Create.save();
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (req, res) => {
  try {
    BlogModel.find({}).then((response) => {
      res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
};

export const delData = async (req, res) => {
  try {
    const body = req.body;
    const id = body._id;
    res.send("Delete Successfully!");
    const del = await BlogModel.findOneAndDelete({ _id: id });
    // console.log(del);
  } catch (error) {
    console.log(error);
  }
};

export const ReadPost = async (req, res) => {
  const { blogId } = req.body;
  const data = await BlogModel.findById(blogId);
  res.send(data);
};

export const UpdatePost = async (req, res) => {
  const { _id, Title, Message } = req.body;
  await BlogModel.findByIdAndUpdate(_id, { Title, Message });
};

export const PostRegisterData = async (req, res) => {
  const body = req.body;
  const { Email } = req.body;
  const { FirstName, LastName, Eamil, Password, ConfirmPassword, Gender } =
    req.body;
  let register = RegisterModel(body);
  try {
    const matchemail = await RegisterModel.findOne({ Email: Email });
    if (matchemail) {
      res.send({ User: true });
    }
    if (
      FirstName == "" ||
      LastName == "" ||
      Eamil == "" ||
      Password == "" ||
      ConfirmPassword == "" ||
      Gender == ""
    ) {
      res.send({ field: true });
    } else {
      register.save();
      res.send({ reg: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const LoginUser = async (req, res) => {
  const { Email, Password } = req.body;
  if (Email == null && Password == null) {
    res.send({ valid: true });
  }
  try {
    const matchemail = await RegisterModel.findOne({ Email: Email });
    console.log(matchemail);
    if (matchemail) {
      bcrypt.compare(Password, matchemail.Password).then(async (e) => {
        if (e === true) {
          const token = jwt.sign({ _id: matchemail._id }, "Auth");
          await RegisterModel.findByIdAndUpdate(matchemail._id, {
            Token: token,
          });
          res.send({ token: token, login: true, userData: matchemail });
        } else {
          res.send({ match: true });
        }
      });
    } else {
      res.send({ reg: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const About = async (req, res) => {
  const token = req.body.Token;
  if (token === null) {
    res.send("login");
    console.log("login");
  } else {
    console.log(token);
    const tokenverify = jwt.verify(token, "Auth");
    console.log(tokenverify, "Verify");
    try {
      const data = await RegisterModel.findOne({ _id: tokenverify._id });
      res.send({ data: data, login: true });
    } catch (error) {
      console.log(error);
    }
  }
};

export const Logout = async (req, res) => {
  const logout = jwt.sign(
    {
      _id: "auth",
    },
    "Auth",
    {
      expiresIn: "1sec",
    }
  );
  console.log(logout, "logout");
};
