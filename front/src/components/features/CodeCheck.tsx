import { Grid } from "@mui/material";
import { CodeCheckInput } from "./CodeCheckInput";
import { CodeCheckList } from "./CodeCheckList";
import { useState } from "react";

export const CodeCheck = () => {
  const [code, setCode] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");

  const checkCode = () => {
    console.log("チェックします：" + code);
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
          <CodeCheckList checkCode={checkCode} />
        </Grid>
      </Grid>
    </>
  );
};
