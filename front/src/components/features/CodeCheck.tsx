import { Grid } from "@mui/material";
import { CodeCheckInput } from "./CodeCheckInput";
import { CodeCheckList } from "./CodeCheckList";
import { useState } from "react";
import { ExecResult } from "../../types/execResult";
import { ErrorResolve } from "../../types/errorResolve";

export const CodeCheck = () => {
  const [code, setCode] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");

  const [checkButtonDisabled, setCheckButtonDisabled] =
    useState<boolean>(false);

  const checkCode = async () => {
    setCheckButtonDisabled(true);
    console.log("チェックします：" + code);

    let execResult: ExecResult;
    let errorResolve: ErrorResolve;

    //exec apiに接続して、codeとinputを送信する
    try {
      //codeが殻の場合はエラーを返す
      if (code === "") {
        alert("コードが入力されていません");
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
      //ステータスコードが200以外の場合はエラーを返す
      /*if (response.status !== 200) {
        alert("コードの実行時にエラーが発生しました。200以外");
        const data = {
          status: "exit",
          error: ["コードの実行時にエラーが発生しました。"],
        };
        execResult = data;
        setCheckButtonDisabled(false);
        return;
      }*/
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
        errorResolve = await response.json();
        console.log("エラーの解決法のリスト" + errorResolve);
        console.log(errorResolve);
      } catch (error) {
        alert("エラーの解決法の取得時にエラーが発生しました。");
        setCheckButtonDisabled(false);
        return;
      }
    }

    setCheckButtonDisabled(false);
  };

  // exec apiに接続して、codeとinputを送信する
  // その結果をsetExecResultListに入れる
  /*const execCode = async () => {
    try {
      //codeが殻の場合はエラーを返す
      if (code === "") {
        alert("コードが入力されていません");
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
      //ステータスコードが200以外の場合はエラーを返す
      if (response.status !== 200) {
        alert("コードの実行時にエラーが発生しました。");
        const data = {
          status: "exit",
          error: ["コードの実行時にエラーが発生しました。"],
        };
        return data;
      }
      const data = await response.json();
      console.log("実行結果" + data.status + "エラー" + data.error);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  //error-resolve apiを読んで、エラーの対処法を受け取る
  const getErrorResolve = async (error: any) => {
    try {
      const url = "http://localhost:3000/program/error-resolve";
      const dataObj = {
        error: error,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObj),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };*/

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
          />
        </Grid>
      </Grid>
    </>
  );
};
