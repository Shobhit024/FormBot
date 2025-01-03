import { useEffect, useState } from "react";
import style from "./responsePage.module.css";

import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Cookies from "js-cookie";
import axios from "axios";
import "react-loading-skeleton/dist/skeleton.css";

const ResponsePage = () => {
  const tokenId = Cookies.get("tokenId") || "";
  const param = useParams();
  const [responseData, setResponseData] = useState([]);
  const [skeleton, setSkeleton] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showDataDetails, setShowDataDetails] = useState([]);

  const fetchFolderFn = async () => {
    const tokenId = Cookies.get("tokenId");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/get_bot_response/${
          param.botId
        }/`,
        {
          headers: {
            Authorization: `Bearer ${tokenId}`,
          },
          withCredentials: true,
        }
      );
      setResponseData(res.data.botResponse);
      setSkeleton(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.", {
        duration: 2000,
      });
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchFolderFn();
  }, [param.botId]);

  const dateFormate = (createdAtDate) => {
    if (!createdAtDate) return "Invalid date";
    const date = new Date(createdAtDate);
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleString("en-IN", options);
  };

  const giveFirstQuestion = (botArr) => {
    const findFirstAnswerBot = botArr.find((bot) => bot.category === "Bubble");
    return findFirstAnswerBot?.value || "N/A";
  };

  const giveFirstAnswer = (botArr) => {
    const findFirstAnswerBot = botArr.find((bot) => bot.category === "Input");
    return findFirstAnswerBot?.value || "N/A";
  };

  const showResponseDetails = (data) => {
    setShowDataDetails(data?.botResponseArr || []);
    setShowPopUp(true);
  };

  return (
    <>
      <div className={style.responseMainContainer}>
        {/* boxContainer */}
        <div className={style.boxContainer}>
          <div className={style.box}>
            <div>Total Response</div>
            <div style={{ fontSize: ".9rem", color: "gray" }}>
              {responseData.length === 0
                ? "No Any Response"
                : responseData.length}
            </div>
          </div>
        </div>
        {/* submissionContainer */}
        <table>
          <thead>
            <tr>
              <th scope="col">Submitted at</th>
              <th scope="col">Button 1</th>
              <th scope="col">Email 1</th>
              <th scope="col">Text 1</th>
              <th scope="col">Button 2</th>
              <th scope="col">Rating 1</th>
            </tr>
          </thead>
          <tbody>
            {skeleton ? (
              <tr>
                {Array.from({ length: 4 }).map((_, i) => (
                  <td key={i}>
                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                      <div style={{ width: "100%" }}>
                        <Skeleton height={30} borderRadius={5} />
                      </div>
                    </SkeletonTheme>
                  </td>
                ))}
              </tr>
            ) : responseData.length === 0 ? (
              <tr>
                <td style={{ textAlign: "center" }} colSpan="5">
                  No any response till now
                </td>
              </tr>
            ) : (
              responseData.map((data) => (
                <tr key={data._id}>
                  <td
                    onClick={() => showResponseDetails(data)}
                    style={{
                      color: "#007BFF",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {data._id}
                  </td>
                  <td>{giveFirstQuestion(data.botResponseArr)}</td>
                  <td>{giveFirstAnswer(data.botResponseArr)}</td>
                  <td>{dateFormate(data.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* responsePopUpShow */}
        {showPopUp && (
          <div
            style={{ backgroundImage: `url(${backgroundImage})` }}
            className={style.responsePopUpShow}
          >
            <div
              onClick={() => setShowPopUp(false)}
              style={{
                fontSize: "1.3rem",
                position: "fixed",
                right: "15px",
                zIndex: "2000",
                color: "red",
                cursor: "pointer",
              }}
            >
              <RxCross2 />
            </div>
            {showDataDetails.map((bot, i) => (
              <div
                style={{
                  transform:
                    bot.category === "Input"
                      ? "translate(-50px)"
                      : "translateX(50px)",
                  background: bot.category === "Bubble" ? "#4ec464" : "#18181b",
                  color: bot.category === "Bubble" && "black",
                }}
                key={i}
                className={style.botBox}
              >
                {bot.category === "Bubble" ? (
                  <div>
                    {bot.type === "Image" && (
                      <img
                        src={bot.value}
                        alt="Question"
                        height={250}
                        width={250}
                      />
                    )}
                    {bot.type === "Video" &&
                      (bot.value.includes("youtube.com") ||
                      bot.value.includes("youtu.be") ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${
                            new URL(bot.value).searchParams.get("v") ||
                            bot.value.split("/").pop()
                          }`}
                          height={250}
                          width={250}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="YouTube video"
                        ></iframe>
                      ) : (
                        <video
                          src={bot.value}
                          controls
                          height={200}
                          width={200}
                        />
                      ))}
                    {bot.type === "GIF" && (
                      <img
                        src={bot.value}
                        alt="Question"
                        height={200}
                        width={200}
                        className={style.gifQuestion}
                      />
                    )}
                    {bot.type === "Text" && (
                      <p style={{ fontSize: "15px", fontWeight: "400" }}>
                        {bot.value}
                      </p>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: "15px", fontWeight: "400" }}>
                    {bot.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ResponsePage;
