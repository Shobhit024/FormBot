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
import axios from "axios";

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

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDarkMode = theme === "dark";

  // logout handler
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const logoutHandler = async () => {
    try {
      if (!tokenId) {
        toast.error("You are not authenticated.");
        navigate("/login");
        return;
      }

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

      if (res.status >= 200 && res.status < 300) {
        Cookies.remove("tokenId");
        toast.success(res.data.msg || "Logged out successfully", {
          duration: 100,
        });
        localStorage.removeItem("authState");
        sessionStorage.clear();
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Logout failed");
      console.log(error);
    }
  };

  // for header drop down

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

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
    if (!tokenId) {
      toast.error("You are not authenticated.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/get_folder_details`,
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

  const deleteFolderHandler = async (folderId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/delete_folder/${folderId}`,
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

  // Share Button Logic
  const handleShare = () => {
    const shareData = {
      title: "Folder Details",
      text: `Check out the folder details: ${window.location.href}`,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => toast.success("Folder shared successfully!"))
        .catch((error) => toast.error(`Error sharing: ${error.message}`));
    } else {
      navigator.clipboard.writeText(shareData.text);
      toast.success("Link copied to clipboard!");
    }
  };

  const saveFolderFn = async (folderName) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/create_folder`,
        {
          method: "POST",
          headers: {
            Authorization: tokenId,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ folderName }),
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to create folder.");
      }
      toast.success("Folder created successfully!");
      fetchFolderFn(); // Refresh folders
    } catch (error) {
      toast.error(error.message);
    }
  };

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
            <div className={style.nameSpace}>
              <div onClick={toggleDropdown} className={style.dropdownButton}>
                {userName}'s workspace ▼
              </div>
              {isDropdownOpen && (
                <div className={style.dropdownMenu}>
                  <div className={style.dropdownItem}>Settings</div>
                  <div onClick={logoutHandler} className={style.dropdownItem1}>
                    Log Out
                  </div>
                </div>
              )}
            </div>

            <div>
              <span className={style.lightLabel}>Light</span>
              <input
                type="checkbox"
                className={style.checkbox}
                id="themeToggle"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <label className={style.label} htmlFor="themeToggle">
                <span className={style.slider}></span>
              </label>
              <span className={style.darkLabel}>Dark</span>

              <button onClick={handleShare} className={style.shareBtn}>
                Share
              </button>
            </div>
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
            {foldersArr?.map((folder) => (
              <NavLink
                key={folder._id}
                to={`/folder/${folder.folderName}`}
                className={({ isActive }) =>
                  `${isActive && style.activeBackground} ${style.folderBox}`
                }
              >
                {folder.folderName}
                {folder.folderName !== "main" && (
                  <RiDeleteBin6Line
                    className={style.deleteButton}
                    onClick={() => {
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
                <div
                  onClick={() => setShowCreateFolder(false)}
                  style={{ cursor: "pointer" }}
                >
                  Cancel
                </div>
              </div>
            </div>
          )}
          {showFolderDelete.display && (
            <div className={style.addFolderPopup}>
              <h1 style={{ textAlign: "center" }}>
                Are you sure you want to delete this folder ?{" "}
                {showFolderDelete.index}
              </h1>
              <div className={style.cancelCreateBtn}>
                <button
                  style={{ color: "#4B83FF" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFolderDelete({ display: false });
                    const findIndex = foldersArr.findIndex(
                      (folder) => folder._id == showFolderDelete.folderId
                    );
                    foldersArr.splice(findIndex, 1);
                    navigate("/folder/main");
                    deleteFolderHandler(showFolderDelete.folderId);
                  }}
                >
                  Confirm
                </button>
                <div className={style.stand}>|</div>
                <button
                  onClick={() => {
                    setShowFolderDelete({ display: false });
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
