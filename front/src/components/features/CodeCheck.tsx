import { Grid } from "@mui/material";
import { CodeCheckInput } from "./CodeCheckInput";
import { CodeCheckList } from "./CodeCheckList";
import { useState } from "react";
import { ExecResult } from "../../types/execResult";

export const CodeCheck = () => {
  const [code, setCode] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");

  const [checkButtonDisabled, setCheckButtonDisabled] =
    useState<boolean>(false);

  const [execResult, setExecResult] = useState<ExecResult>({
    status: "",
    error: [],
  });

  const checkCode = () => {
    setCheckButtonDisabled(true);
    console.log("チェックします：" + code);
    execCode();
    console.log(
      "実行結果：" + execResult.status + "エラー：" + execResult.error
    );
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
      const data = await response.json();
      console.log(data);
      setExecResult(data);
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
