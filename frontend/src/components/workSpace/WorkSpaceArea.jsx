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
import axios from "axios";

const WorkSpaceArea = ({ isBotSaved }) => {
  const tokenId = Cookies.get("tokenId");
  const { folderName, botName, botId } = useParams();
  const data = useSelector((store) => store?.bot?.data || {});
  const updateData = useSelector(
    (store) => store?.botUpdateReducer?.updateData || {}
  );
  const [botDetails, setBotDetails] = useState([]);
  const [skeleton, setSkeleton] = useState(isBotSaved);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mainRoute = location.pathname.split("/")[3];

  const hasChanges = useCallback(() => {
    return (
      botDetails?.length !== 0 &&
      updateData.botArr?.length !== 0 &&
      JSON.stringify(botDetails[0]) !== JSON.stringify(updateData)
    );
  }, [botDetails, updateData]);

  const handleBotSave = async () => {
    if (!data?.botName) return toast.error("Please enter a bot name.");
    if (data?.botArr?.length === 0) return toast.error("Bot can't be empty.");

    const toastId = toast.loading("Creating...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/save_bot`,
        { data, folder: folderName },
        {
          headers: {
            Authorization: tokenId,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.msg, { id: toastId, duration: 1000 });
        localStorage.removeItem("storeBot");
        navigate(`/folder/${folderName}`);
      } else {
        toast.error(response.data.msg, { id: toastId, duration: 1000 });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
      navigate("/");
    }
  };

  const handleBotNameChange = (e) => {
    const newBotName = e.target.value;
    const updatedData = isBotSaved
      ? { ...updateData, botName: newBotName }
      : {
          ...(JSON.parse(localStorage.getItem("storeBot")) || {}),
          botName: newBotName,
        };
    updatedData.botName = newBotName;

    isBotSaved
      ? dispatch(setBotUpdate(updatedData))
      : localStorage.setItem("storeBot", JSON.stringify(updatedData));

    dispatch(setBot(updatedData));
  };

  const fetchFolderDetails = useCallback(async () => {
    if (!folderName || !botName) {
      return toast.error("Invalid folder or bot name.");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/get_folder_details`,
        {
          headers: { Authorization: tokenId },
          withCredentials: true,
        }
      );
      const folder = response.data.allFolder.find(
        (folder) => folder.folderName === folderName
      );
      const bot = folder?.allBots.find((bot) => bot.botName === botName);
      setBotDetails(bot ? [bot] : []);
      setSkeleton(false);
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
      navigate("/");
    }
  }, [navigate, folderName, botName, tokenId]);

  const handleBotUpdate = async () => {
    if (!hasChanges())
      return toast.error("No changes detected.", { duration: 700 });

    const toastId = toast.loading("Updating...");
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/bot_update/${botId}`,
        updateData,
        {
          headers: {
            Authorization: tokenId,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.msg, { id: toastId, duration: 1000 });
        navigate(`/folder/${folderName}`);
      } else {
        toast.error(response.data.msg, { id: toastId, duration: 1000 });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const handleBotDelete = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/bot_delete/${botId}`,
        {
          headers: {
            Authorization: tokenId,
            "Content-Type": "application/json",
          },
          withCredentials: true,
          data: { folderName },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.msg, { id: toastId });
        navigate(`/folder/${folderName}`);
      } else {
        toast.error(response.data.msg, { id: toastId });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  useEffect(() => {
    if (folderName && botName) {
      fetchFolderDetails();
    }
  }, [fetchFolderDetails, folderName, botName]);

  return (
    <div className={style.workSpaceMainContainer}>
      <header>
        <div className={style.left}>
          <input
            value={isBotSaved ? updateData?.botName || botName : data?.botName}
            type="text"
            onChange={handleBotNameChange}
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
            Flow
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
          {isBotSaved ? (
            <div className={style.threeBtn}>
              <button onClick={handleBotDelete} className={style.deleteBtn}>
                Delete
              </button>
              <button
                onClick={handleBotUpdate}
                className={hasChanges() ? style.updateBtn : style.notUpdateBtn}
              >
                Update
              </button>
            </div>
          ) : (
            <button
              onClick={handleBotSave}
              className={
                data?.botArr?.length !== 0 && data?.botName?.length !== 0
                  ? style.saveBtn
                  : style.notUpdateBtn
              }
            >
              Save
            </button>
          )}
          <div
            onClick={() => navigate("/folder/main")}
            style={{ color: "#F55050", fontSize: "1.4rem", cursor: "pointer" }}
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
      {mainRoute === "response" && <ResponsePage isBotSaved={isBotSaved} />}
      <Outlet />
    </div>
  );
};

export default WorkSpaceArea;
