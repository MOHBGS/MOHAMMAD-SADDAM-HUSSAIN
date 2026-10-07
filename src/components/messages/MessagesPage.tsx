import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Send,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Phone,
  Video,
  Check,
  CheckCheck,
  X,
  MessageSquare,
  ChevronRight,
  Camera,
  AlertCircle,
  RefreshCw,
  Eye,
  ArrowDown,
} from 'lucide-react';
import { ChatImageLightbox } from './ChatImageLightbox';
import { validateImageFile, uploadChatImage, formatFileSize } from '../../utils/storage';
import { Message } from '../../types';

export const MessagesPage: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    getConversationMessages,
    sendMessage,
    retrySendMessage,
    currentUser,
    viewUserProfile,
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const [convFilterTab, setConvFilterTab] = useState<'all' | 'unread' | 'online'>('all');
  const [showEmojiTray, setShowEmojiTray] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // File upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Fullscreen lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const messages = activeConv ? getConversationMessages(activeConv.id) : [];

  // All image messages in current conversation for lightbox navigation
  const imageMessages = messages.filter(
    (m) => m.messageType === 'image' || !!m.mediaUrl
  );

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeConversationId]);

  // Clean up preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const query = searchConv.toLowerCase().trim();

  const filteredConversations = conversations.filter((c) => {
    if (convFilterTab === 'unread' && c.unreadCount === 0) return false;
    if (convFilterTab === 'online' && !c.isOnline) return false;

    if (!query) return true;

    const matchesName =
      c.participant.fullName.toLowerCase().includes(query) ||
      c.participant.username.toLowerCase().includes(query) ||
      c.participant.collegeName.toLowerCase().includes(query);

    const matchesLastMessage = c.lastMessage.toLowerCase().includes(query);

    const convMsgs = getConversationMessages(c.id);
    const matchesMessageHistory = convMsgs.some((m) =>
      m.text.toLowerCase().includes(query)
    );

    return matchesName || matchesLastMessage || matchesMessageHistory;
  });

  // Handle native file selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    setShowAttachmentMenu(false);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate using storage utility
    const validation = validateImageFile(file, 10 * 1024 * 1024);
    if (!validation.valid) {
      setImageError(validation.error || 'Invalid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      return;
    }

    setSelectedImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);
  };

  const handleRemoveImagePreview = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv) return;
    if (!messageText.trim() && !selectedImageFile) return;

    // If an image is ready to send
    if (selectedImageFile) {
      setIsUploading(true);
      setUploadProgress(15);
      setImageError(null);

      try {
        const tempMsgId = `m_${Date.now()}`;
        const uploadResult = await uploadChatImage(
          selectedImageFile,
          activeConv.id,
          tempMsgId,
          (progress) => setUploadProgress(progress)
        );

        sendMessage(activeConv.id, messageText.trim(), {
          mediaUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize,
          mediaType: selectedImageFile.type,
        });

        handleRemoveImagePreview();
        setMessageText('');
        setIsUploading(false);
        setUploadProgress(null);
      } catch (err: any) {
        setIsUploading(false);
        setUploadProgress(null);
        setImageError(err?.message || 'Image failed to send. Please try again.');
      }
    } else {
      // Normal text message
      sendMessage(activeConv.id, messageText.trim());
      setMessageText('');
    }

    setShowEmojiTray(false);
    setShowAttachmentMenu(false);
  };

  const handleEmojiClick = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  const openImageInLightbox = (msg: Message) => {
    const idx = imageMessages.findIndex((m) => m.id === msg.id);
    if (idx !== -1) {
      setActiveLightboxIndex(idx);
      setIsLightboxOpen(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-20 lg:pb-8 h-[calc(100vh-6rem)] animate-fade-in flex flex-col">
      <div className="bg-white rounded-3xl border border-pink-100/80 shadow-sm overflow-hidden flex-1 flex flex-col md:flex-row">
        {/* Left Column: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col ${
            activeConversationId && 'hidden md:flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Campus Messages
            </h2>
            <span className="text-[11px] font-semibold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
              {conversations.length} Active
            </span>
          </div>

          {/* Search conversations */}
          <div className="p-3 border-b border-slate-100 space-y-2">
            <div className="relative">
              <input
                type="text"
                value={searchConv}
                onChange={(e) => setSearchConv(e.target.value)}
                placeholder="Search by student name or messages..."
                className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-pink-400 rounded-xl outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {searchConv && (
                <button
                  type="button"
                  onClick={() => setSearchConv('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'online', label: 'Online' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setConvFilterTab(tab.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    convFilterTab === tab.id
                      ? 'bg-pink-500 text-white'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {searchConv && (
                <span className="text-[10px] text-pink-600 font-semibold ml-auto">
                  {filteredConversations.length} found
                </span>
              )}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <div className="text-xs font-bold text-slate-700">No matching conversations</div>
                <p className="text-[11px] text-slate-500">
                  {searchConv
                    ? `No chats matching "${searchConv}"`
                    : 'No conversations in this filter'}
                </p>
                {searchConv && (
                  <button
                    type="button"
                    onClick={() => setSearchConv('')}
                    className="text-xs font-semibold text-pink-600 hover:underline pt-1 cursor-pointer"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                const isLastMsgImage = conv.lastMessage.includes('📷 Image') || conv.lastMessage.includes('Image');

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`group relative p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-200 ease-out active:scale-[0.985] select-none border ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-50/95 via-rose-50/50 to-purple-50/20 border-pink-200/90 shadow-xs shadow-pink-500/5'
                        : 'bg-transparent border-transparent hover:bg-slate-50/90 hover:border-slate-200/70 hover:shadow-2xs hover:translate-x-1'
                    }`}
                  >
                    {/* Active vertical pill indicator */}
                    {isSelected && (
                      <span className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-r-full shadow-xs shadow-pink-500/40" />
                    )}

                    {/* Avatar with status ring */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.participant.profilePhoto}
                        alt={conv.participant.fullName}
                        className={`w-12 h-12 rounded-2xl object-cover transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-pink-500 shadow-sm shadow-pink-500/20'
                            : 'ring-1 ring-slate-200 group-hover:ring-pink-300'
                        }`}
                      />
                      {conv.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`text-xs font-bold truncate transition-colors duration-200 ${
                            isSelected
                              ? 'text-pink-900 font-extrabold'
                              : 'text-slate-900 group-hover:text-pink-600'
                          }`}
                        >
                          {conv.participant.fullName}
                        </span>
                        <span
                          className={`text-[10px] flex-shrink-0 ml-1 transition-colors ${
                            isSelected
                              ? 'text-pink-600 font-semibold'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs truncate transition-colors duration-200 flex items-center gap-1 ${
                            isSelected
                              ? 'text-pink-800/90 font-medium'
                              : conv.unreadCount > 0
                              ? 'font-bold text-slate-800'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          {isLastMsgImage ? (
                            <span className="inline-flex items-center gap-1 text-pink-600 font-semibold">
                              <ImageIcon className="w-3 h-3" />
                              <span>Photo</span>
                            </span>
                          ) : (
                            conv.lastMessage
                          )}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ml-1.5 shadow-xs shadow-pink-500/30">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        <div className={`flex-1 flex flex-col bg-slate-50/50 ${
          !activeConversationId && 'hidden md:flex'
        }`}>
          {activeConv ? (
            <>
              {/* Chat Top Bar */}
              <div className="p-3.5 sm:p-4 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-2xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveConversationId(null)}
                    className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>

                  <div
                    onClick={() => viewUserProfile(activeConv.participant.id)}
                    className="relative cursor-pointer"
                  >
                    <img
                      src={activeConv.participant.profilePhoto}
                      alt={activeConv.participant.fullName}
                      className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                    {activeConv.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div
                    onClick={() => viewUserProfile(activeConv.participant.id)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{activeConv.participant.fullName}</span>
                      {activeConv.participant.isVerified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}
                    </h3>
                    <div className="text-[10px] sm:text-[11px] text-slate-400">
                      {activeConv.participant.collegeName} &middot;{' '}
                      <span className="text-emerald-600 font-semibold">Online now</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    type="button"
                    onClick={() => alert(`Voice calling ${activeConv.participant.fullName} via College Voice...`)}
                    className="p-2 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                    title="Audio call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Starting video session with ${activeConv.participant.fullName}...`)}
                    className="p-2 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                    title="Video call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                {/* Safe chatting info banner */}
                <div className="text-center my-2">
                  <span className="inline-block px-3 py-1 bg-pink-50 text-pink-700 text-[10px] font-semibold rounded-full border border-pink-100">
                    🔒 Verified Student Chat &middot; End-to-end encrypted &middot; Private images
                  </span>
                </div>

                {messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id;
                  const isImageMessage = msg.messageType === 'image' || !!msg.mediaUrl;
                  const imageUrl = msg.mediaUrl || msg.thumbnailUrl;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      {/* Image Message Bubble */}
                      {isImageMessage && imageUrl ? (
                        <div
                          className={`group relative max-w-[82%] sm:max-w-sm rounded-3xl p-1.5 transition-all shadow-xs ${
                            isMine
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xs'
                              : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                          }`}
                        >
                          {/* Clickable Image Box */}
                          <div
                            onClick={() => openImageInLightbox(msg)}
                            className="relative overflow-hidden rounded-2xl bg-slate-900 cursor-pointer aspect-auto max-h-72 flex items-center justify-center"
                          >
                            <img
                              src={msg.thumbnailUrl || imageUrl}
                              alt={msg.fileName || 'Shared photo'}
                              loading="lazy"
                              className="w-full h-full object-cover max-h-72 group-hover:scale-102 transition-transform duration-300"
                            />
                            {/* Hover overlay hint */}
                            <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-[1px]">
                              <Eye className="w-4 h-4" />
                              <span>Click to enlarge</span>
                            </div>

                            {/* Badge with file size */}
                            {msg.fileSize && (
                              <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-mono">
                                {formatFileSize(msg.fileSize)}
                              </span>
                            )}
                          </div>

                          {/* Optional Caption */}
                          {msg.text && msg.text !== 'Shared an image' && (
                            <div className="px-2.5 pt-2 pb-1 text-xs sm:text-sm leading-relaxed">
                              {msg.text}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Text Message Bubble */
                        <div
                          className={`max-w-[78%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isMine
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}

                      {/* Timestamp & Delivery status */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 px-1">
                        <span>{msg.createdAt}</span>
                        {isMine && (
                          <>
                            {msg.uploadStatus === 'failed' ? (
                              <button
                                type="button"
                                onClick={() => retrySendMessage(activeConv.id, msg.id)}
                                className="text-rose-500 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                              >
                                <AlertCircle className="w-3 h-3" />
                                <span>Retry</span>
                              </button>
                            ) : msg.uploadStatus === 'sending' ? (
                              <span className="text-slate-400">Sending...</span>
                            ) : (
                              <CheckCheck
                                className={`w-3.5 h-3.5 ${
                                  msg.readStatus ? 'text-sky-500' : 'text-pink-500'
                                }`}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji tray popup */}
              {showEmojiTray && (
                <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar animate-fade-in">
                  {['❤️', '😂', '🔥', '✨', '📸', '☕', '📚', '🍕', '🎸', '👏', '🎉', '🌸', '💬'].map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => handleEmojiClick(e)}
                      className="text-xl p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              {/* Image Preview Before Sending Area */}
              {imagePreviewUrl && (
                <div className="p-3 bg-white border-t border-pink-100 flex items-center gap-3 animate-fade-in shadow-sm">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 group">
                    <img
                      src={imagePreviewUrl}
                      alt="Selected attachment preview"
                      className="w-full h-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Metadata & Status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {selectedImageFile?.name || 'Image ready to send'}
                      </span>
                      {selectedImageFile && (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                          {formatFileSize(selectedImageFile.size)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-pink-600 font-medium mt-0.5">
                      {isUploading
                        ? `Uploading to campus storage... ${uploadProgress || 15}%`
                        : 'Image ready to send &bull; Add optional caption below'}
                    </p>

                    {/* Upload progress bar */}
                    {isUploading && uploadProgress !== null && (
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Cancel / Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemoveImagePreview}
                    disabled={isUploading}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                    title="Remove selected image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Image Error Alert */}
              {imageError && (
                <div className="px-4 py-2.5 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{imageError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageError(null)}
                    className="text-rose-500 hover:text-rose-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2 relative"
              >
                {/* Hidden native file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                {/* Emoji Trigger */}
                <button
                  type="button"
                  onClick={() => setShowEmojiTray(!showEmojiTray)}
                  className="p-2 text-slate-400 hover:text-pink-600 transition-colors cursor-pointer"
                  title="Insert emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Attachment / Image Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                    title="Attach campus photo"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  {/* Attachment popup menu */}
                  {showAttachmentMenu && (
                    <div className="absolute bottom-12 left-0 w-48 bg-white rounded-2xl shadow-xl border border-pink-100 p-1.5 space-y-1 z-30 animate-fade-in">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachmentMenu(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4 text-pink-500" />
                        <span>Choose From Device</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachmentMenu(false);
                          cameraInputRef.current?.click();
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-rose-500" />
                        <span>Take Photo</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Message / Caption Input */}
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={
                    selectedImageFile
                      ? 'Add a caption for this photo (optional)...'
                      : `Message ${activeConv.participant.fullName.split(' ')[0]}...`
                  }
                  className="flex-1 px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-pink-400 transition-all"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isUploading || (!messageText.trim() && !selectedImageFile)}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUploading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <div className="text-4xl">💌</div>
              <h3 className="text-base font-bold text-slate-700">No chat selected</h3>
              <p className="text-xs">Pick a campus conversation from the list to start chatting.</p>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Image Lightbox / Viewer */}
      <ChatImageLightbox
        isOpen={isLightboxOpen}
        activeImageIndex={activeLightboxIndex}
        imageMessages={imageMessages}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIdx) => setActiveLightboxIndex(newIdx)}
      />
    </div>
  );
};
