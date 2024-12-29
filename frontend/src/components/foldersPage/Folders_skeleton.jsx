import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import icon from "./../../assets/icon.png";
import style from "./folders.module.css";

const Folders_skeleton = () => {
  const navigate = useNavigate();

  return (
    <div className={style.skeletonContainer}>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <header className={style.skeletonHeader}>
          <div
            onClick={() => navigate("/")}
            className={style.formBotHeader}
            role="button"
            tabIndex={0}
          >
            <img src={icon} alt="FormBot Logo" />
            <div>FormBot</div>
          </div>
          <Skeleton width={200} height={40} borderRadius={5} />
        </header>

        <div className={style.skeletonControls}>
          <Skeleton width="20%" height={40} borderRadius={5} />
          <Skeleton width="8%" height={40} borderRadius={5} />
          <Skeleton width="8%" height={40} borderRadius={5} />
          <Skeleton width="8%" height={40} borderRadius={5} />
        </div>

        <div className={style.skeletonCards}>
          <Skeleton width="20%" height={270} borderRadius={5} />
          <Skeleton width="20%" height={270} borderRadius={5} />
          <Skeleton width="20%" height={270} borderRadius={5} />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default Folders_skeleton;
