import { Chip, Typography } from "@mui/material";
import { CheckMissResult } from "../../types/checkMissResult";
import { ErrorResolve } from "../../types/errorResolve";

type Props = {
  errorResolveList: ErrorResolve[];
  foundMissList: CheckMissResult[];
};

export const CheckResult = (props: Props) => {
  const { errorResolveList } = props;
  const { foundMissList } = props;
  if (errorResolveList.length === 0 && foundMissList.length === 0) {
    return <p>おめでとうございます。問題は見つかりませんでした。</p>;
  } else {
    return (
      <>
        {errorResolveList.map((errorResolve, index) => (
          <>
            <div key={index}>
              <Typography variant="h6">
                <Chip label="必ず修正" color="error" /> {errorResolve.row}行目{" "}
                {errorResolve.column}文字目
              </Typography>
              <Typography variant="h5">{errorResolve.description}</Typography>
              <textarea defaultValue={errorResolve.error} cols={40} />
              <Typography variant="h6">修正方法</Typography>
              <div style={{ background: "#fffee8" }}>
                <Typography variant="body1">{errorResolve.method}</Typography>
              </div>
              <hr />
            </div>
          </>
        ))}
        {foundMissList.map((foundMiss, index) => (
          <>
            <div key={index}>
              <Typography variant="h6">
                <Chip label="確認" color="warning" /> {foundMiss.row}行目
              </Typography>
              <Typography variant="h5">{foundMiss.description}</Typography>
              <hr />
            </div>
          </>
        ))}
      </>
    );
  }
};
