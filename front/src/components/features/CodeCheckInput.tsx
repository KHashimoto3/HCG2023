import { Container } from "@mui/material";

type Props = {
  code: string;
  setCode: (code: string) => void;
};

export const CodeCheckInput = (props: Props) => {
  const { code, setCode } = props;
  return (
    <>
      <Container maxWidth="md">
        <h1>Code Docter</h1>
        <textarea
          rows={20}
          cols={45}
          style={{ fontSize: "18pt", borderRadius: "10px" }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </Container>
    </>
  );
};
