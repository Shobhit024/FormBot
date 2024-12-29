import style from "./mainDashboard.module.css";
import icon from "./../../assets/icon.png";
import rotateImg1 from "./../../assets/rotateImg1.png";
import rotateImg2 from "./../../assets/rotateImg2.png";
import heroImg from "./../../assets/heroImg.png";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const MainDashboard = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Get token from cookies
  const tokenId = Cookies.get("tokenId");

  useEffect(() => {
    // Check login status
    if (tokenId) {
      fetchFolderFn();
    } else {
      setIsLogin(false); // If no token, set isLogin to false
    }
  }, [tokenId]);

  // Function to check login status from the backend
  const fetchFolderFn = async () => {
    try {
      const res = await fetch(
        "https://form-bot-backend1.vercel.app/api/isLoginCheck",
        {
          method: "GET",
          headers: {
            Authorization: tokenId, // Send token in the header
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Login check failed: " + res.statusText);
      }

      const data = await res.json();
      console.log("Login status:", data);
      setIsLogin(data.loggedIn); // Update state based on backend response
    } catch (error) {
      console.error("Login check error:", error);
      toast.error("Error checking login status!");
    }
  };

  // Form submission handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setTimeout(() => setIsFormSubmitted(false), 2000); // Reset form submission state after 2 seconds
  };

  // Logout handler
  const logoutHandler = async () => {
    try {
      const res = await fetch(
        "https://form-bot-backend1.vercel.app/api/logout",
        {
          method: "POST",
          headers: {
            Authorization: tokenId, // Send token for authentication
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Logout failed: " + res.statusText);
      }

      const result = await res.json();
      toast.success(result.msg, { duration: 1000 }); // Display logout success message
      Cookies.remove("tokenId"); // Remove token from cookies
      setIsLogin(false); // Update login state to false
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out!");
    }
  };

  return (
    <div className={style.main}>
      {/* Header Navigation */}
      <header className={style.header}>
        <div className={style.left}>
          <img src={icon} alt="FormBot Icon" />
          <div>FormBot</div>
        </div>
        <div className={style.right}>
          {!isLogin ? (
            <Link to="/login" className={style.signInBtn}>
              Sign in
            </Link>
          ) : (
            <div onClick={logoutHandler} className={style.logoutBtn}>
              Logout
            </div>
          )}
          <Link to="/folder/main" className={style.createFormBtn}>
            Create a FormBot
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className={style.hero}>
        <img src={rotateImg1} alt="Decorative" />
        <div className={style.heroTextArea}>
          <h1 className={style.h1Text}>Build advanced chatbots visually</h1>
          <p className={style.pText}>
            Typebot gives you powerful blocks to create unique chat experiences.
            Embed them anywhere on your web/mobile apps and start collecting
            results like magic.
          </p>
          <Link to="/folder/main" className={style.getStartedBtn}>
            Create a FormBot for free
          </Link>
        </div>
        <img src={rotateImg2} alt="Decorative" />
      </div>

      {/* Main Hero Image Section */}
      <div className={style.heroImgArea}>
        <div className={style.circleFirst}></div>
        <img src={heroImg} alt="Hero" />
        <div className={style.circleSecond}></div>
      </div>

      {/* Footer Section */}
      <footer className={style.footer}>
        <div className={style.left}>
          <img src={icon} alt="FormBot Icon" />
          <div>FormBot</div>
        </div>
        <div className={style.footerLeft}>
          <p>
            Made with ❤️ by <br /> @cuvette
          </p>
        </div>
        <div className={style.footerCenter}>
          <p>Product</p>
          <a href="#status" target="_blank" rel="noopener noreferrer">
            Status <FaExternalLinkAlt />
          </a>
          <a href="#documentation" target="_blank" rel="noopener noreferrer">
            Documentation <FaExternalLinkAlt />
          </a>
          <a href="#roadmap" target="_blank" rel="noopener noreferrer">
            Roadmap <FaExternalLinkAlt />
          </a>
          <a href="#pricing" target="_blank" rel="noopener noreferrer">
            Pricing
          </a>
        </div>
        <div className={style.footerCenter}>
          <p>Community</p>
          <a href="#discord" target="_blank" rel="noopener noreferrer">
            Discord <FaExternalLinkAlt />
          </a>
          <a href="#github" target="_blank" rel="noopener noreferrer">
            GitHub repository <FaExternalLinkAlt />
          </a>
          <a href="#twitter" target="_blank" rel="noopener noreferrer">
            Twitter <FaExternalLinkAlt />
          </a>
          <a href="#linkedin" target="_blank" rel="noopener noreferrer">
            LinkedIn <FaExternalLinkAlt />
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
  );
};

export default MainDashboard;
