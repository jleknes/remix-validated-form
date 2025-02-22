import { useFetcher } from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useFormContext, ValidatedForm } from "remix-validated-form";
import * as yup from "yup";
import { Input } from "~/components/Input";

const schema = yup.object({
  name: yup.string().required(),
});
const validator = withYup(schema);

export default function FrontendValidation() {
  const { submit } = useFormContext("test-form");
  const fetcher = useFetcher();
  return (
    <>
      {fetcher.data?.message && <p>From fetcher: {fetcher.data.message}</p>}
      <ValidatedForm
        validator={validator}
        method="post"
        id="test-form"
        action="/submission/helper-with-action/action"
        fetcher={fetcher}
      >
        <Input name="name" label="Name" />
      </ValidatedForm>
      <button
        type="button"
        onClick={() => {
          submit();
        }}
      >
        Submit with helper
      </button>
    </>
  );
}
