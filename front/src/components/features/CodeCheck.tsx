import { Grid } from "@mui/material";
import { CodeCheckInput } from "./CodeCheckInput";
import { CodeCheckList } from "./CodeCheckList";

export const CodeCheck = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <CodeCheckInput />
        </Grid>
        <Grid item xs={6}>
          <CodeCheckList />
        </Grid>
      </Grid>
    </>
  );
};
