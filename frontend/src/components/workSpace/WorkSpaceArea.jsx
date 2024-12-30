import { useCallback, useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  NavLink,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import { setBot } from "../../redux/botSlice";
import style from "./workSpaceAera.module.css";
import BotPage from "../botPage/BotPage";

import ResponsePage from "../responsePage/ResponsePage";
import { setBotUpdate } from "../../redux/botUpdateSlice";
import Cookies from "js-cookie";

const WorkSpaceArea = ({ isBotSaved }) => {
  const tokenId = Cookies.get("tokenId");
  const param = useParams();
  const { folderName, botName, botId } = param;
  const data = useSelector((store) => store?.botReducer?.data);
  const updateData = useSelector(
    (store) => store?.botUpdateReducer?.updateData
  );
  const [botDetails, setBotDetails] = useState(null); // Initialize as null
  const [skeleton, setSkeleton] = useState(isBotSaved);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mainRoute = location.pathname.split("/")[3];

  useEffect(() => {
    if (!tokenId) {
      navigate("/login"); // Redirect if no token
    }
  }, [tokenId, navigate]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const hasChanges = () => {
    if (
      !botDetails ||
      !updateData.botArr ||
      Object.keys(updateData).length === 0
    )
      return false;
    const isBotDetailsChanged =
      JSON.stringify(botDetails[0]) !== JSON.stringify(updateData);
    return isBotDetailsChanged;
  };

  const botNameHandler = (e) => {
    const newBotName = e.target.value;
    dispatch(setBot({ ...data, botName: newBotName }));
  };

  const deleteBotHandler = () => {
    // Delete bot logic
    toast.success("Bot deleted successfully!");
  };

  const shareBotHandler = () => {
    // Share bot logic
    toast.success("Bot shared successfully!");
  };

  const updateBotHandler = () => {
    if (hasChanges()) {
      dispatch(setBotUpdate({ ...updateData }));
      toast.success("Bot updated successfully!");
    } else {
      toast.error("No changes detected.");
    }
  };

  const botArrSaveHandler = () => {
    if (data.botArr?.length && data.botName) {
      dispatch(setBot({ ...data }));
      toast.success("Bot saved successfully!");
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  return (
    <div className={`${style.workSpaceMainContainer} ${style[theme]}`}>
      <header>
        <div className={style.left}>
          <input
            value={isBotSaved ? updateData.botName || botName : data.botName}
            type="text"
            onChange={botNameHandler}
            placeholder="Enter Bot Name"
          />
        </div>
        <div className={style.center}>
          <NavLink
            to={
              isBotSaved
                ? `/folder/${folderName}/bot/${botName}/${botId}`
                : `/folder/${folderName}/bot`
            }
            className={({ isActive }) =>
              `${isActive ? style.botText : ""} ${style.navTxt}`
            }
          >
            Bot
          </NavLink>
          <NavLink
            to={
              isBotSaved
                ? `/folder/${folderName}/theme/${botName}/${botId}`
                : `/folder/${folderName}/theme`
            }
            className={({ isActive }) =>
              `${isActive ? style.botText : ""} ${style.navTxt}`
            }
          >
            Theme
          </NavLink>
          {isBotSaved && (
            <NavLink
              to={`/folder/${folderName}/response/${botName}/${botId}`}
              className={({ isActive }) =>
                `${isActive ? style.botText : ""} ${style.navTxt}`
              }
            >
              Response
            </NavLink>
          )}
        </div>
        <div className={style.right}>
          <button onClick={toggleTheme} className={style.themeToggleBtn}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          {isBotSaved ? (
            <div className={style.threeBtn}>
              <button onClick={deleteBotHandler} className={style.deleteBtn}>
                Delete
              </button>
              <button onClick={shareBotHandler} className={style.shareBtn}>
                Share
              </button>
              <button
                onClick={updateBotHandler}
                className={hasChanges() ? style.updateBtn : style.notUpdateBtn}
                style={{ cursor: hasChanges() ? "pointer" : "not-allowed" }}
              >
                Update
              </button>
            </div>
          ) : (
            <button
              onClick={botArrSaveHandler}
              className={
                data.botArr?.length && data.botName
                  ? style.saveBtn
                  : style.notUpdateBtn
              }
              style={{
                cursor:
                  data.botArr?.length && data.botName
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              Save
            </button>
          )}
          <div
            onClick={() => navigate("/folder/main")}
            style={{
              color: "#F55050",
              transform: "translateY(3px)",
              fontSize: "1.4rem",
              cursor: "pointer",
            }}
          >
            <RxCross2 />
          </div>
        </div>
      </header>
      {mainRoute === "bot" && (
        <BotPage
          isBotSaved={isBotSaved}
          botDetails={botDetails}
          skeleton={skeleton}
        />
      )}
      {mainRoute === "theme" && (
        <ThemePage isBotSaved={isBotSaved} botDetails={botDetails} />
      )}
      {mainRoute === "response" && <ResponsePage isBotSaved={isBotSaved} />}
      <Outlet />
    </div>
  );
};

export default WorkSpaceArea;
