import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import style from "./folders.module.css";
import { HiOutlineFolderPlus } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Folders_skeleton from "./Folders_skeleton";
import icon from "./../../assets/icon.png";
import { setBotUpdate } from "../../redux/botUpdateSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

const Folders = () => {
  const tokenId = Cookies.get("tokenId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showFolderDelete, setShowFolderDelete] = useState({
    display: false,
    folderId: "",
  });
  const [folderName, setFolderName] = useState("");
  const [foldersArr, setFoldersArr] = useState([]);
  const [skeleton, setSkeleton] = useState(true);
  const params = useParams();
  const [userName, setUserName] = useState("");

  const folderInputHandler = () => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }
    const alreadyExists = foldersArr.some(
      (folder) => folder.folderName === folderName.trim()
    );
    if (alreadyExists) {
      toast.error("Folder name already exists");
      return;
    }
    saveFolderFn(folderName.trim());
    setFolderName("");
    setShowCreateFolder(false);
  };

  const fetchFolderFn = useCallback(async () => {
    try {
      const res = await fetch(
        "https://form-bot-backend1.vercel.app/api/get_folder_details",
        {
          method: "GET",
          headers: { Authorization: tokenId },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("You need to log in first");
      }
      const result = await res.json();
      setUserName(result.user?.name || "User");
      setFoldersArr(result.allFolder || []);
    } catch (error) {
      toast.error(error.message);
      navigate("/login");
    } finally {
      setSkeleton(false);
    }
  }, [navigate, tokenId]);

  useEffect(() => {
    fetchFolderFn();
  }, [fetchFolderFn]);

  const saveFolderFn = async (folderName) => {
    try {
      const res = await fetch(
        "https://form-bot-backend1.vercel.app/api/create_folder",
        {
          method: "POST",
          headers: {
            Authorization: tokenId,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ folderName }),
        }
      );
      if (!res.ok) throw new Error("Failed to create folder");
      await fetchFolderFn();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteFolderHandler = async (folderId) => {
    try {
      const res = await fetch(
        `https://form-bot-backend1.vercel.app/api/delete_folder/${folderId}`,
        {
          method: "DELETE",
          headers: { Authorization: tokenId },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete folder");
      setFoldersArr((prev) => prev.filter((folder) => folder._id !== folderId));
      toast.success("Folder deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const botArrFn = useCallback(() => {
    if (foldersArr && params.folderName) {
      const selectedFolder = foldersArr.find(
        (folder) => folder.folderName === params.folderName
      );
      return selectedFolder?.allBots || [];
    }
    return [];
  }, [foldersArr, params.folderName]);

  useEffect(() => {
    localStorage.setItem(
      "storeBot",
      JSON.stringify({ botName: "", theme: "light", botArr: [] })
    );
    dispatch(setBotUpdate({}));
  }, [dispatch]);

  return (
    <>
      {skeleton ? (
        <Folders_skeleton />
      ) : (
        <div
          className={style.mainPage}
          onClick={() => {
            if (showCreateFolder) setShowCreateFolder(false);
            if (showFolderDelete.display)
              setShowFolderDelete({ display: false, folderId: "" });
          }}
        >
          <header>
            <div onClick={() => navigate("/")} className={style.formBotHeader}>
              <img src={icon} alt="FormBot Icon" />
              <div>FormBot</div>
            </div>
            <div className={style.nameSpace}>Hi 👋🏻 {userName}</div>
          </header>
          <div className={style.folderBoxContainer}>
            <div
              className={style.folderBox}
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateFolder(true);
              }}
            >
              <HiOutlineFolderPlus /> Create a folder
            </div>
            {foldersArr.map((folder) => (
              <NavLink
                key={folder._id}
                to={`/folder/${folder.folderName}`}
                className={({ isActive }) =>
                  `${isActive ? style.activeBackground : ""} ${style.folderBox}`
                }
              >
                {folder.folderName}
                {folder.folderName !== "main" && (
                  <RiDeleteBin6Line
                    className={style.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFolderDelete({
                        display: true,
                        folderId: folder._id,
                      });
                    }}
                  />
                )}
              </NavLink>
            ))}
          </div>
          <div className={style.boxContainer}>
            <Link to={`/folder/${params.folderName}/bot`} className={style.box}>
              <div style={{ fontSize: "4rem", paddingBottom: "16px" }}>+</div>
              <div style={{ fontSize: "19px", fontWeight: "400" }}>
                Create a typebot
              </div>
            </Link>
            {botArrFn().map((bot) => (
              <Link
                key={bot._id}
                to={`/folder/${params.folderName}/bot/${bot.botName}/${bot._id}`}
                className={style.box}
              >
                <div style={{ fontSize: "19px", fontWeight: "400" }}>
                  {bot.botName}
                </div>
              </Link>
            ))}
          </div>
          {showCreateFolder && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={style.addFolderPopup}
            >
              <h1>Create a folder</h1>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
                placeholder="Enter folder name"
              />
              <div className={style.cancelCreateBtn}>
                <button
                  onClick={folderInputHandler}
                  style={{ color: "#4B83FF" }}
                >
                  Done
                </button>
                <div className={style.stand}>|</div>
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {showFolderDelete.display && (
            <div className={style.addFolderPopup}>
              <h1>Are you sure you want to delete this folder?</h1>
              <div className={style.cancelCreateBtn}>
                <button
                  style={{ color: "#4B83FF" }}
                  onClick={() => {
                    deleteFolderHandler(showFolderDelete.folderId);
                    setShowFolderDelete({ display: false, folderId: "" });
                  }}
                >
                  Confirm
                </button>
                <div className={style.stand}>|</div>
                <button
                  onClick={() => {
                    setShowFolderDelete({ display: false, folderId: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Folders;
