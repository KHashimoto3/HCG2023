import { Box, Button, Container } from "@mui/material";
import { CheckResult } from "./CheckResult";
import { ErrorResolve } from "../../types/errorResolve";
import { CheckMissResult } from "../../types/checkMissResult";

type Props = {
  checkCode: () => void;
  checkButtonDisabled: boolean;
  errorResolveList: ErrorResolve[];
  foundMissList: CheckMissResult[];
};

export const CodeCheckList = (props: Props) => {
  const { checkCode } = props;
  const { checkButtonDisabled } = props;
  const { errorResolveList } = props;
  const { foundMissList } = props;
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
          <CheckResult
            errorResolveList={errorResolveList}
            foundMissList={foundMissList}
          />
        </Box>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={checkCode}
          disabled={checkButtonDisabled}
        >
          チェックする
        </Button>
      </Container>
    </>
  );
};
