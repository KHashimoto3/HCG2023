import { Box, Button, Container } from "@mui/material";
import { CheckResult } from "./CheckResult";

export const CodeCheckList = () => {
  return (
    <>
      <Container maxWidth="md">
        <h1>チェック結果が表示されます</h1>
        <Box
          sx={{
            justifyContent: "center",
            borderRadius: "10px",
            border: "1px solid black",
            padding: "10px",
            height: "400px",
          }}
        >
          <CheckResult />
        </Box>
        <Button variant="contained" sx={{ mt: 2 }}>
          チェックする
        </Button>
      </Container>
    </>
  );
};
