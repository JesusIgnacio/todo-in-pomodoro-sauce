import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, Upload, X, Check, EyeOff, Loader } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  initializeMLService, 
  processImageFile, 
  processCameraCapture,
  clearResults,
  clearError,
  toggleTodoSelection,
  selectAllTodos,
  deselectAllTodos,
  updateTodoText
} from '../../store/slices/imageProcessingSlice';
import { addTodo, GTDContext } from '../../store/slices/todoSlice';


const ExtractorContainer = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  color: white;
`;

const Title = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const CloseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Tab = styled(motion.button)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ContentArea = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  min-height: 300px;
`;

const CameraContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  
  video {
    width: 100%;
    height: auto;
    max-height: 300px;
    object-fit: cover;
  }
`;

const CameraControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProcessingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: white;
  z-index: 10;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    transition: width 0.3s ease;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 1.5rem;
`;

const TodoItem = styled(motion.div)<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.selected ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.selected ? 'rgba(46, 204, 113, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.selected ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const TodoText = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const ConfidenceBar = styled.div<{ $confidence: number }>`
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.$confidence * 100}%;
    height: 100%;
    background: ${props => 
      props.$confidence > 0.7 ? '#2ecc71' : 
      props.$confidence > 0.4 ? '#f39c12' : '#e74c3c'
    };
  }
`;

const BulkActions = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const ImportButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(46, 204, 113, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

type TabType = 'camera' | 'upload';

export const ImageTodoExtractor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { 
    isProcessing, 
    isInitialized, 
    error, 
    extractedTodos, 
    selectedTodos,
    processingProgress 
  } = useAppSelector(state => state.imageProcessing);

  const [activeTab, setActiveTab] = useState<TabType>('camera');
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Initialize ML service on component mount
  React.useEffect(() => {
    if (!isInitialized && !isProcessing && !error) {
      dispatch(initializeMLService());
    }
  }, [dispatch, isInitialized, isProcessing, error]);

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const canvas = webcamRef.current.getCanvas();
      if (canvas) {
        dispatch(processCameraCapture(canvas));
      }
    }
  }, [dispatch]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      dispatch(processImageFile(file));
    }
  }, [dispatch]);

  const handleTodoToggle = useCallback((todoText: string) => {
    dispatch(toggleTodoSelection(todoText));
  }, [dispatch]);

  const handleTodoTextChange = useCallback((originalText: string, newText: string) => {
    dispatch(updateTodoText({ originalText, newText }));
  }, [dispatch]);

  const handleImportSelected = useCallback(() => {
    selectedTodos.forEach(todoText => {
      const extractedTodo = extractedTodos.find(t => t.text === todoText);
      const context = (extractedTodo?.context as GTDContext) || 'inbox';
      dispatch(addTodo({ text: todoText, context }));
    });
    
    dispatch(clearResults());
    onClose();
  }, [selectedTodos, extractedTodos, dispatch, onClose]);

  const handleSelectAll = useCallback(() => {
    dispatch(selectAllTodos());
  }, [dispatch]);

  const handleDeselectAll = useCallback(() => {
    dispatch(deselectAllTodos());
  }, [dispatch]);

  return (
    <ExtractorContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>
          <Camera size={20} />
          Extract Todos from Image
        </Title>
        <CloseButton
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </CloseButton>
      </Header>

      <TabContainer>
        <Tab
          $active={activeTab === 'camera'}
          onClick={() => setActiveTab('camera')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Camera size={18} />
          Camera
        </Tab>
        <Tab
          $active={activeTab === 'upload'}
          onClick={() => setActiveTab('upload')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={18} />
          Upload
        </Tab>
      </TabContainer>

      <ContentArea>
        <AnimatePresence mode="wait">
          {activeTab === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {!showCamera ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <ActionButton
                    onClick={() => setShowCamera(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera size={20} />
                    Start Camera
                  </ActionButton>
                </div>
              ) : (
                <>
                  <CameraContainer>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: "environment"
                      }}
                    />
                  </CameraContainer>
                  <CameraControls>
                    <ActionButton
                      onClick={handleCapture}
                      disabled={isProcessing}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Camera size={20} />
                      Capture & Extract
                    </ActionButton>
                    <ActionButton
                      onClick={() => setShowCamera(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <EyeOff size={20} />
                      Stop Camera
                    </ActionButton>
                  </CameraControls>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <FileUploadArea onClick={() => fileInputRef.current?.click()}>
                <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.7 }} />
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Upload an Image</h4>
                <p style={{ margin: 0, opacity: 0.8 }}>
                  Click here or drag and drop an image with todos, notes, or tasks
                </p>
              </FileUploadArea>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <ProcessingOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader size={48} className="animate-spin" />
              <h4 style={{ margin: '1rem 0 0.5rem 0' }}>Processing Image...</h4>
              <p style={{ margin: 0, opacity: 0.8 }}>
                Extracting todos using AI vision
              </p>
              <ProgressBar progress={processingProgress} />
            </ProcessingOverlay>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(231, 76, 60, 0.2)',
              border: '1px solid rgba(231, 76, 60, 0.5)',
              borderRadius: '12px',
              padding: '1rem',
              color: 'white',
              marginTop: '1rem'
            }}
          >
            <strong>Error:</strong> {error}
            <ActionButton
              onClick={() => dispatch(clearError())}
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
            >
              Dismiss
            </ActionButton>
          </motion.div>
        )}

        {/* Results */}
        {extractedTodos.length > 0 && (
          <ResultsContainer>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>
                Found {extractedTodos.length} potential todos:
              </h4>

              <BulkActions>
                <ActionButton
                  onClick={handleSelectAll}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check size={16} />
                  Select All
                </ActionButton>
                <ActionButton
                  onClick={handleDeselectAll}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} />
                  Deselect All
                </ActionButton>
              </BulkActions>

              {extractedTodos.map((todo, index) => (
                <TodoItem
                  key={index}
                  selected={selectedTodos.includes(todo.text)}
                  onClick={() => handleTodoToggle(todo.text)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTodos.includes(todo.text)}
                    onChange={() => handleTodoToggle(todo.text)}
                    style={{ margin: 0 }}
                  />
                  <TodoText
                    value={todo.text}
                    onChange={(e) => handleTodoTextChange(todo.text, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <ConfidenceBar $confidence={todo.confidence} />
                  <span style={{ fontSize: '0.8rem', opacity: 0.8, minWidth: '40px' }}>
                    {Math.round(todo.confidence * 100)}%
                  </span>
                </TodoItem>
              ))}

              {selectedTodos.length > 0 && (
                <ImportButton
                  onClick={handleImportSelected}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginTop: '1rem' }}
                >
                  <Check size={20} />
                  Import {selectedTodos.length} Todo{selectedTodos.length !== 1 ? 's' : ''}
                </ImportButton>
              )}
            </motion.div>
          </ResultsContainer>
        )}
      </ContentArea>
    </ExtractorContainer>
  );
};
