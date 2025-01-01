import style from "./mainDashboard.module.css";
import icon from "./../../assets/icon.png";
import rotateImg1 from "./../../assets/rotateImg1.png";
import rotateImg2 from "./../../assets/rotateImg2.png";
import heroImg from "./../../assets/heroImg.png";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const MainDashboard = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const tokenId = Cookies.get("tokenId");
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const fetchFolderFn = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/isLoginCheck`, {
        headers: {
          Authorization: tokenId,
        },
        withCredentials: true,
      });
      setIsLogin(res.status === 200);
    } catch (error) {
      console.log(error);
      setIsLogin(false);
    }
  };

  useEffect(() => {
    fetchFolderFn();
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/logout`,
        {},
        {
          headers: {
            Authorization: tokenId,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        Cookies.remove("tokenId");
        toast.success(res.data.msg, { duration: "100" });
        setIsLogin(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={style.main}>
        {/* header nav */}
        <header className={style.header}>
          <div className={style.left}>
            <img src={icon} alt="" />
            <div>FormBot</div>
          </div>
          <div className={style.right}>
            {!isLogin ? (
              <Link to={"/login"} className={`${style.signInBtn} `}>
                Sign in
              </Link>
            ) : (
              <div onClick={logoutHandler} className={`${style.logoutBtn} `}>
                Logout
              </div>
            )}
            <Link to={"/folder/main"} className={style.createFormBtn}>
              Create a FormBot
            </Link>
          </div>
        </header>
        {/* Hero Section */}
        <div className={style.hero}>
          <img src={rotateImg1} alt="" />
          <div className={style.heroTextArea}>
            <h1 className={style.h1Text}>
              Build advanced chatbots <br></br> visually
            </h1>
            <p className={style.pText}>
              Typebot gives you powerful blocks to create unique chat
              experiences. Embed them anywhere on your web/mobile apps and start
              collecting results like magic.
            </p>
            <Link to={"/folder/main"} className={style.getStartedBtn}>
              Create a FormBot for free
            </Link>
          </div>
          <img src={rotateImg2} alt="" />
        </div>
        {/* Main Hero Image Section */}
        <div className={style.heroImgArea}>
          <div className={style.circleFirst}></div>
          <img src={heroImg} alt="" />
          <div className={style.circleSecond}></div>
        </div>

        {/* footer section */}

        <footer className={style.footer}>
          <div className={style.footerLeft}>
            <div className={style.left}>
              <img src={icon} alt="FormBot Icon" />
              <div>FormBot</div>
            </div>
            <p>
              Made with
              <span role="img" aria-label="love">
                ❤️
              </span>
              by <br /> @cuvette
            </p>
          </div>
          <div className={style.footerCenter}>
            <p>Product</p>
            <a href="#status" target="_blank" rel="noopener noreferrer">
              Status <FaExternalLinkAlt style={{ height: "10px" }} />{" "}
            </a>
            <a href="#documentation" target="_blank" rel="noopener noreferrer">
              Documentation <FaExternalLinkAlt style={{ height: "10px" }} />{" "}
            </a>
            <a href="#roadmap" target="_blank" rel="noopener noreferrer">
              Roadmap <FaExternalLinkAlt style={{ height: "10px" }} />{" "}
            </a>
            <a href="#pricing" target="_blank" rel="noopener noreferrer">
              Pricing
            </a>
          </div>
          <div className={style.footerCenter}>
            <p>Community</p>
            <a href="#discord" target="_blank" rel="noopener noreferrer">
              Discord <FaExternalLinkAlt style={{ height: "10px" }} />{" "}
            </a>
            <a href="#github" target="_blank" rel="noopener noreferrer">
              GitHub repository <FaExternalLinkAlt style={{ height: "10px" }} />{" "}
            </a>
            <a href="#twitter" target="_blank" rel="noopener noreferrer">
              Twitter <FaExternalLinkAlt style={{ height: "10px" }} />{" "}
            </a>
            <a href="#linkedin" target="_blank" rel="noopener noreferrer">
              LinkedIn <FaExternalLinkAlt style={{ height: "10px" }} />{" "}
            </a>
            <a href="#oss-friends" target="_blank" rel="noopener noreferrer">
              OSS Friends
            </a>
          </div>
          <div className={style.footerRight}>
            <p>Company</p>
            <a href="#about" target="_blank" rel="noopener noreferrer">
              About
            </a>
            <a href="#contact" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
            <a href="#terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            <a href="#privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainDashboard;
