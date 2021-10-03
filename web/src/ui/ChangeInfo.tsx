import { Button } from '@chakra-ui/button';
import cloneDeep from 'clone-deep';
import { Form, Formik } from 'formik';
import {
  MeDocument,
  MeQuery,
  useMeQuery,
  useUpdateInfoMutation,
} from '../generated/graphql';

import { EditableField } from './ContentEditable';

export const ChangeInfo = () => {
  const { data } = useMeQuery();
  const [updateInfo, { loading }] = useUpdateInfoMutation();
  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: 24, marginBottom: 16, fontWeight: 600 }}>
        Thay đổi thông tin
      </h2>
      <Formik
        initialValues={{
          firstName: data?.me?.firstName || '',
          lastName: data?.me?.lastName || '',
        }}
        onSubmit={async ({ firstName, lastName }, { setErrors }) => {
          updateInfo({
            variables: { input: { firstName, lastName } },
            update: (cache, { data, errors }) => {
              if (!data?.updateInfo) return;
              const meQuery = cache.readQuery<MeQuery>({
                query: MeDocument,
              });
              if (!meQuery?.me) return;
              const draft = cloneDeep(meQuery!.me);

              if (firstName) {
                draft.firstName = firstName;
              }

              if (lastName) {
                draft.lastName = lastName;
              }

              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: draft,
                },
              });
            },
          });
        }}
      >
        {() => (
          <Form>
            <EditableField
              name="firstName"
              label="Họ và tên đệm"
              defaultValue={data?.me?.firstName || ''}
            />
            <EditableField
              name="lastName"
              label="Tên"
              defaultValue={data?.me?.lastName || ''}
            />
            <Button
              isLoading={loading}
              isDisabled={loading}
              type="submit"
              marginTop={2}
            >
              Thay đổi
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
