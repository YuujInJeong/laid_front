import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const AppContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #1A237E 0%, #4FC3F7 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  color: #FFEB3B;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Section = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: rgba(26, 35, 126, 0.8);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: #333;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  margin-bottom: 20px;
  font-size: 1.2rem;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
  }
`;

const Button = styled.button`
  background-color: #FFEB3B;
  border: none;
  color: #1A237E;
  padding: 15px 32px;
  font-size: 18px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 50px;
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #FFCDD2;
    transform: scale(1.05);
  }
`;

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setOriginalImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageProcessing = async () => {
    if (originalImage) {
      setIsProcessing(true);
      try {
        const formData = new FormData();
        formData.append('image', originalImage);

        const response = await axios.post('http://localhost:5000/process', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProcessedImage(`data:image/png;base64,${response.data.image}`);
      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <AppContainer>
      <Title>LA:D Image Processor</Title>

      <Section>
        <ImageContainer>
          {originalImage ? (
            <img src={originalImage} alt="Original" />
          ) : (
            "원본 이미지를 업로드하세요"
          )}
        </ImageContainer>
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <Button onClick={() => document.getElementById('upload-input')?.click()}>
          이미지 업로드
        </Button>
      </Section>

      <Section>
        <ImageContainer>
          {processedImage ? (
            <img src={processedImage} alt="Processed" />
          ) : (
            "버튼을 눌러 변환을 시작하세요"
          )}
        </ImageContainer>
        <Button onClick={handleImageProcessing} disabled={isProcessing || !originalImage}>
          {isProcessing ? '처리 중...' : '이미지 변환'}
        </Button>
      </Section>
    </AppContainer>
  );
};

export default App;


