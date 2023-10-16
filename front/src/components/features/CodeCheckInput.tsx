import { Container } from "@mui/material";

export const CodeCheckInput = () => {
  return (
    <>
      <Container maxWidth="md">
        <h1>左側のコンポーネントです。</h1>
        <textarea
          rows={20}
          cols={45}
          style={{ fontSize: "18pt", borderRadius: "10px" }}
        />
      </Container>
    </>
  );
};
