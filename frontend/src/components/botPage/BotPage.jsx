const BotPage = ({ isBotSaved, skeleton, botDetails }) => {
  const tokenId = Cookies.get("tokenId");
  const updateData = useSelector(
    (store) => store?.botUpdateReducer?.updateData
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mainFolder = location.pathname.split("/")[2];
  let botName = decodeURI(location.pathname.split("/")[4]);
  const localData = JSON.parse(localStorage.getItem("storeBot"));
  const [botArr, setBotArr] = useState(updateData.botArr);
  const [botData, setBotData] = useState({
    botName: "",
    theme: "light",
    botArr,
  });

  const fetchFolderFn = useCallback(async () => {
    if (!tokenId) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(
        `https://form-bot-backend1.vercel.app/api/bot_details/${mainFolder}/${botName}`,
        {
          method: "GET",
          headers: { Authorization: tokenId },
          credentials: "include",
        }
      );
      const result = await res.json();
      if (res.ok) {
        if (Object.keys(updateData)?.length === 0) {
          setBotArr(result.botArr);
          dispatch(setBotUpdate(result));
        }
      } else {
        toast.error(result.msg);
        navigate(`/folder/${mainFolder}`);
      }
    } catch (error) {
      console.log(error);
    }
  }, [mainFolder, botName, tokenId, updateData, dispatch, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isBotSaved) fetchFolderFn();
  }, [fetchFolderFn, isBotSaved]);

  const botClkHandler = (type, category) => {
    setBotArr((prevBotArr) => [...prevBotArr, { type, category, value: "" }]);
  };

  const deleteBotHandler = (i) => {
    setBotArr(botArr.filter((_, index) => index !== i));
  };

  const botInputHandler = (event, i) => {
    setBotArr((prevBot) =>
      prevBot.map((bot, innerIndex) => {
        if (innerIndex !== i) return bot;
        return { ...bot, value: event.target.value };
      })
    );
  };

  useEffect(() => {
    if (!isBotSaved) {
      const data = { ...botData, botArr };
      data.botName = localData.botName || "";
      dispatch(setBot(data));
    } else {
      const updatedData = { ...updateData, botArr };
      dispatch(setBotUpdate(updatedData));
    }
  }, [botArr, botData, isBotSaved, dispatch, localData, updateData]);

  useEffect(() => {
    if (!isBotSaved) {
      setBotArr(localData.botArr || []);
      setBotData({
        botName: localData.botName || "",
        theme: localData.theme || "light",
        botArr: localData.botArr || [],
      });
    }
  }, [mainFolder, isBotSaved, localData]);

  let occurrenceCounter = useRef({});

  function countWithSequence(type, category) {
    const key = `${type}-${category}`;
    if (!occurrenceCounter.current[key]) {
      occurrenceCounter.current[key] = 1;
    } else {
      occurrenceCounter.current[key] += 1;
    }
    return occurrenceCounter.current[key];
  }

  return (
    <div className={style.mainContainer}>{/* The rest of your JSX code */}</div>
  );
};

export default BotPage;
