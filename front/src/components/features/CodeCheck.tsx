import { Grid } from "@mui/material";
import { CodeCheckInput } from "./CodeCheckInput";
import { CodeCheckList } from "./CodeCheckList";
import { useState } from "react";
import { ExecResult } from "../../types/execResult";
import { ErrorResolve } from "../../types/errorResolve";
import { CheckMissResult } from "../../types/checkMissResult";

export const CodeCheck = () => {
  const [code, setCode] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");

  const [errorResolveList, setErrorResolveList] = useState<ErrorResolve[]>([]);
  const [foundMissList, setFoundMissList] = useState<CheckMissResult[]>([]);

  const [checkButtonDisabled, setCheckButtonDisabled] =
    useState<boolean>(false);

  const checkCode = async () => {
    setCheckButtonDisabled(true);
    console.log("チェックします：" + code);

    let execResult: ExecResult;
    let errorResolve: ErrorResolve[];
    let foundMisses: CheckMissResult[];

    //exec apiに接続して、codeとinputを送信する
    try {
      //codeが殻の場合はエラーを返す
      if (code === "") {
        alert("コードが入力されていません");
        setCheckButtonDisabled(false);
        return;
      }
      let dataObj = {
        code: code,
        input: codeInput,
      };
      //inputが殻の場合は、inputにnoneを入れる
      if (codeInput === "") {
        dataObj.input = "none";
      }
      const url = "http://localhost:3000/program/exec";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObj),
      });
      execResult = await response.json();
      console.log("実行結果" + execResult.status + "エラー" + execResult.error);
    } catch (error) {
      alert("コードの実行時にエラーが発生しました。catch");
      setCheckButtonDisabled(false);
      return;
    }

    if (execResult.error.length >= 1) {
      //error-resolve apiに接続して、エラーの対処法を受け取る
      try {
        const url = "http://localhost:3000/program/error-resolve";
        const dataObj = {
          errors: execResult.error,
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataObj),
        });
        const recieveData = await response.json();
        errorResolve = recieveData.resolve;
        console.log("エラーの解決法のリスト" + errorResolve);
        console.log(errorResolve);
      } catch (error) {
        alert("エラーの解決法の取得時にエラーが発生しました。");
        setCheckButtonDisabled(false);
        return;
      }

      setErrorResolveList(errorResolve);
    }

    //check-miss-apiに接続して、ありがちなミスを受け取る
    try {
      const url = "http://localhost:3000/program/check-miss";
      const dataObj = {
        code: code,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObj),
      });
      const recieveData = await response.json();
      foundMisses = recieveData.misses;
      console.log("ありがちなミスのリスト" + foundMisses);
      console.log(foundMisses);
    } catch (error) {
      alert("ありがちなミスの取得時にエラーが発生しました。");
      setCheckButtonDisabled(false);
      return;
    }

    setFoundMissList(foundMisses);
    console.log("全ての処理が終了しました。");

    setCheckButtonDisabled(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <CodeCheckInput
            code={code}
            setCode={setCode}
            codeInput={codeInput}
            setCodeInput={setCodeInput}
          />
        </Grid>
        <Grid item xs={6}>
          <CodeCheckList
            checkCode={checkCode}
            checkButtonDisabled={checkButtonDisabled}
            errorResolveList={errorResolveList}
            foundMissList={foundMissList}
          />
        </Grid>
      </Grid>
    </>
  );
};
