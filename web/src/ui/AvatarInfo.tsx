import * as React from 'react';
// import AvatarEditor from 'react-avatar-editor';
// import Dropzone from 'react-dropzone';
import {
  GetTopUsersDocument,
  GetTopUsersQuery,
  MeDocument,
  MeQuery,
  TopUser,
  useMeQuery,
  User,
  useUploadAvatarMutation,
} from '../generated/graphql';
import { Image, useColorModeValue, Button, Text } from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import cloneDeep from 'clone-deep';

const AVATAR_URL_PLACEHOLDER =
  'https://avatars.dicebear.com/api/croodles-neutral/';

const CLOUDINARY_UPLOAD_URL =
  'https://api.cloudinary.com/v1_1/dx1jwn9cz/image/upload';

const UPLOAD_PRESET_NAME = 'wdqafr5r';

export const AvatarInfo = () => {
  const { data, loading } = useMeQuery();
  const [uploadAvatar, { loading: preserveUrlLoading }] =
    useUploadAvatarMutation();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState<number>(0);
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

  const handleChangeImage = (e: React.ChangeEvent) => {
    const file = inputRef?.current?.files?.[0];
    if (!file) return null;

    const reader = new FileReader();
    const url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      setImage(reader.result);
    };

    const xhr = new XMLHttpRequest();
    setUploading(true);
    xhr.open('POST', CLOUDINARY_UPLOAD_URL);
    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      setUploading(false);

      uploadAvatar({
        variables: { avatarUrl: response.secure_url },
        update: (cache, { data: uploadData }) => {
          if (!uploadData?.uploadAvatar) return;
          const meQuery = cache.readQuery<MeQuery>({
            query: MeDocument,
          });
          if (meQuery?.me) {
            const draft = cloneDeep(meQuery!.me);
            draft.avatarUrl = reader.result as string;
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                me: draft,
              },
            });
          }

          const getTopUsers = cache.readQuery<GetTopUsersQuery>({
            query: GetTopUsersDocument,
          });

          if (!getTopUsers?.getTopUsers) return;

          const draft = cloneDeep(getTopUsers!.getTopUsers);

          draft.forEach((topUser) => {
            if (topUser.id === data?.me?.id) {
              topUser.avatarUrl = reader.result as string;
            }
          });

          cache.writeQuery<GetTopUsersQuery>({
            query: GetTopUsersDocument,
            data: {
              getTopUsers: draft,
            },
          });
        },
      }).catch((e) => console.log(e));
    };

    xhr.onerror = (event) => {};
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        setProgress(percentage);
      }
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET_NAME);

    xhr.send(formData);
  };
  return (
    <div
      style={{
        width: 200,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <div
        style={{
          borderWidth: '2px',
          borderColor: useColorModeValue('#ddd', '#333'),
          width: 200,
          height: 200,
          borderRadius: '50%',
          position: 'relative',
        }}
      >
        <Image
          src={image}
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
          }}
        />
        <Button
          onClick={() => {
            inputRef.current?.click();
          }}
          disabled={uploading || preserveUrlLoading}
          position="absolute"
          right={-2}
          bottom={4}
          borderWidth={2}
          borderColor={useColorModeValue('gray.300', 'gray.700')}
          backgroundColor={useColorModeValue('gray.100', 'gray.800')}
        >
          <AttachmentIcon />
        </Button>
        <input
          ref={inputRef}
          type="file"
          onChange={handleChangeImage}
          accept="image/*"
          hidden={true}
        />
      </div>
      {uploading && <Text>{progress}%</Text>}

      <p style={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}>
        {data?.me?.firstName} {data?.me?.lastName}
      </p>
      <p style={{ textAlign: 'center' }}>score {data?.me?.score}</p>
    </div>
  );
};
