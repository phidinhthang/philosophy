import { Image } from '@chakra-ui/image';
import * as React from 'react';
// import AvatarEditor from 'react-avatar-editor';
// import Dropzone from 'react-dropzone';
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
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <div>
        <Image
          src={image}
          style={{ width: 200, height: 200, borderRadius: '50%' }}
        />
      </div>

      <p style={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}>
        {data?.me?.firstName} {data?.me?.lastName}
      </p>
      <p style={{ textAlign: 'center' }}>score {data?.me?.score}</p>
    </div>
  );
};
