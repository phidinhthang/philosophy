import { Button } from '@chakra-ui/button';
import { Form, Formik } from 'formik';
import { useMeQuery } from '../generated/graphql';
import { EditableField } from './ContentEditable';

export const ChangeInfo = () => {
  const { data } = useMeQuery();
  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: 24, marginBottom: 16, fontWeight: 600 }}>
        Change Info
      </h2>
      <Formik
        initialValues={{
          firstName: data?.me?.firstName || '',
          lastName: data?.me?.lastName || '',
        }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <EditableField
              name="firstName"
              label="First Name"
              defaultValue={data?.me?.firstName || ''}
            />
            <EditableField
              name="lastName"
              label="Last Name"
              defaultValue={data?.me?.lastName || ''}
            />
            <Button isLoading={isSubmitting} type="submit" marginTop={2}>
              submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
