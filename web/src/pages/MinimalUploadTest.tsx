import { useMutation, gql } from '@apollo/client';
import { useRef } from 'react';

const UPLOAD_RECEIPT = gql`
  mutation UploadReceipt($file: Upload!) {
    uploadReceipt(file: $file) {
      id
      storeName
      imageUrl
    }
  }
`;

export default function MinimalUploadTest() {
  const [uploadReceipt] = useMutation(UPLOAD_RECEIPT);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return alert('No file selected');
    console.log('Uploading file:', file);
    try {
      const result = await uploadReceipt({ variables: { file } });
      alert('Upload success! ' + JSON.stringify(result.data));
    } catch (err) {
      alert('Upload error: ' + err);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={inputRef} />
      <button type="submit">Upload</button>
    </form>
  );
}
