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
              <p>
                必ず修正！ {errorResolve.row}行目 {errorResolve.column}文字目
              </p>
              <p style={{ fontSize: "16pt" }}>{errorResolve.description}</p>
              <textarea defaultValue={errorResolve.error} cols={40} />
              <p>どうすればよい？</p>
              <div style={{ background: "#fffee8" }}>
                <p>{errorResolve.method}</p>
              </div>
              <hr />
            </div>
          </>
        ))}
        {foundMissList.map((foundMiss, index) => (
          <>
            <div key={index}>
              <p>
                確認 {foundMiss.row}行目 {foundMiss.column}文字目
              </p>
              <p style={{ fontSize: "16pt" }}>{foundMiss.description}</p>
              <hr />
            </div>
          </>
        ))}
      </>
    );
  }
};
