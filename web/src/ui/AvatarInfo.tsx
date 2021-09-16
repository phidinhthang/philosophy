import * as React from 'react';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import { useMeQuery } from '../generated/graphql';

const AVATAR_URL_PLACEHOLDER =
  'https://avatars.dicebear.com/api/croodles-neutral/';

export const AvatarInfo = () => {
  const { data, loading } = useMeQuery();
  const handleDrop = (dropped: any) => {
    setImage(dropped[0]);
  };
  const [image, setImage] = React.useState<any>('');
  React.useEffect(() => {
    if (!loading && !data?.me?.avatarUrl) {
      setImage(AVATAR_URL_PLACEHOLDER + `${data?.me?.id}.svg`);
    } else {
      setImage(data?.me?.avatarUrl);
    }
  }, [data]);
  return (
    <div
      style={{
        width: 200,
        height: 200,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Dropzone onDrop={handleDrop} noDrag noKeyboard>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps({
              style: {
                width: 200,
                height: 200,
                marginLeft: 'auto',
                marginRight: 'auto',
              },
            })}
          >
            <AvatarEditor
              width={150}
              height={150}
              image={image}
              color={[255, 255, 255, 0]}
              style={{
                borderRadius: '50%',
                borderWidth: 2,
                borderColor: 'black',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
      <p style={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}>
        {data?.me?.firstName} {data?.me?.lastName}
      </p>
      <p style={{ textAlign: 'center' }}>score {data?.me?.score}</p>
    </div>
  );
};
