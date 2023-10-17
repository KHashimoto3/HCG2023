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

  const checkCode = () => {
    setCheckButtonDisabled(true);
    console.log("チェックします：" + code);
    const checkCodeResult = execCode();
    //dataがExeqResult型でない場合はreturnする
    if (!("status" in checkCodeResult) || !("error" in checkCodeResult)) {
      alert("方チェックのエラーが発生しました");
      setCheckButtonDisabled(false);
      return;
    }

    console.log(
      "実行結果：" + checkCodeResult.status + "エラー：" + checkCodeResult.error
    );

    const errorResolve = getErrorResolve(checkCodeResult.error);

    console.log("エラーの対処法：" + errorResolve);

    setCheckButtonDisabled(false);
  };

  // exec apiに接続して、codeとinputを送信する
  // その結果をsetExecResultListに入れる
  const execCode = async () => {
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
          />
        </Grid>
      </Grid>
    </>
  );
};
