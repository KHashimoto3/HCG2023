import { Box, Button, Container } from "@mui/material";

export const CodeCheckList = () => {
  return (
    <>
      <Container maxWidth="md">
        <h1>右側のコンポーネントです。</h1>
        <Box
          sx={{
            justifyContent: "center",
            borderRadius: "10px",
            border: "1px solid black",
            padding: "10px",
            height: "400px",
          }}
        ></Box>
        <Button variant="contained" sx={{ mt: 2 }}>
          チェック
        </Button>
      </Container>
    </>
  );
};
