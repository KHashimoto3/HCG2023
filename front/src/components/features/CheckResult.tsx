import { ErrorResolve } from "../../types/errorResolve";

type Props = {
  errorResolveList: ErrorResolve[];
};

export const CheckResult = (props: Props) => {
  const { errorResolveList } = props;
  return (
    <>
      {errorResolveList.map((errorResolve, index) => (
        <>
          <div key={index}>
            <p>必ず修正！</p>
            <p>
              {errorResolve.row}行目 {errorResolve.column}文字目
            </p>
            <p>{errorResolve.description}</p>
            <p>{errorResolve.error}</p>
            <p>{errorResolve.method}</p>
            <hr />
          </div>
        </>
      ))}
    </>
  );
};
