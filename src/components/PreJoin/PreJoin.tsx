const PreJoin = () => {
  return (
    <div className='pre-join'>
      <div className='td-video-container'>
        {videoTrack && <video ref={videoEl} width='1280' height='720' data-lk-facing-mode={facingMode} />}
        {(!videoTrack || !videoEnabled) && (
          <div className='lk-camera-off-note'>
            <ParticipantPlaceholder />
          </div>
        )}
      </div>
      <div className='lk-button-group-container'>
        <div className='lk-button-group audio'>
          <TrackToggle
            initialState={audioEnabled}
            source={Track.Source.Microphone}
            onChange={(enabled) => setAudioEnabled(enabled)}
          >
            {micLabel}
          </TrackToggle>
          <div className='lk-button-group-menu'>
            <MediaDeviceMenu
              initialSelection={audioDeviceId}
              kind='audioinput'
              disabled={!audioTrack}
              tracks={{ audioinput: audioTrack }}
              onActiveDeviceChange={(_, id) => setAudioDeviceId(id)}
            />
          </div>
        </div>
        <div className='lk-button-group video'>
          <TrackToggle
            initialState={videoEnabled}
            source={Track.Source.Camera}
            onChange={(enabled) => setVideoEnabled(enabled)}
          >
            {camLabel}
          </TrackToggle>
          <div className='lk-button-group-menu'>
            <MediaDeviceMenu
              initialSelection={videoDeviceId}
              kind='videoinput'
              disabled={!videoTrack}
              tracks={{ videoinput: videoTrack }}
              onActiveDeviceChange={(_, id) => setVideoDeviceId(id)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
