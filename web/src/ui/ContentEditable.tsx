import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  useEditableControls,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

interface EditableFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  defaultValue: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  size: _,
  defaultValue,
  ...props
}) => {
  /* Here's a custom control */

  const [field, {}, { setValue }] = useField(props);
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return (
      <div style={{ position: 'absolute', zIndex: 100, right: 8, top: 4 }}>
        {isEditing ? (
          <ButtonGroup justifyContent="center" size="sm">
            {/* @ts-ignore */}
            <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
            {/* @ts-ignore */}
            <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
          </ButtonGroup>
        ) : (
          <Flex justifyContent="center">
            {/* @ts-ignore */}
            <IconButton
              size="sm"
              icon={<EditIcon />}
              {...getEditButtonProps()}
            />
          </Flex>
        )}
      </div>
    );
  }

  return (
    <div>
      <label>{label}</label>
      <div
        style={{
          backgroundColor: 'white',
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 10,
          position: 'relative',
          marginBottom: 10,
        }}
      >
        <Editable
          defaultValue={field.value}
          value={field.value}
          fontSize="md"
          onBlur={() => {
            if (!field.value) {
              setValue(defaultValue);
            }
            console.log(defaultValue);
          }}
          isPreviewFocusable={false}
        >
          <EditablePreview px={4} py={2} />
          <EditableInput {...field} {...props} id={field.name} px={4} py={2} />
          <EditableControls />
        </Editable>
      </div>
    </div>
  );
};
