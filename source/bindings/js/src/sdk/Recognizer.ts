//
// copyright (c) Microsoft. All rights reserved.
// licensed under the MIT license. See LICENSE.md file in the project root for full license information.
//
import { CognitiveSubscriptionKeyAuthentication, CognitiveTokenAuthentication, Context, Device, IAuthentication, IConnectionFactory, OS, PlatformConfig, RecognitionMode, RecognizerConfig, ServiceRecognizerBase, SpeechRecognitionEvent } from "../common.speech/Exports";
import { RecognitionCompletionStatus, RecognitionEndedEvent } from "../common.speech/RecognitionEvents";
import { Promise, PromiseHelper } from "../common/Exports";
import { Contracts } from "./Contracts";
import { AudioConfig, RecognitionEventArgs, RecognitionEventType, RecognizerParameterNames, SessionEventArgs, SessionEventType } from "./Exports";
import { SpeechConfig, SpeechConfigImpl } from "./SpeechConfig";

/**
 * Defines the base class Recognizer which mainly contains common event handlers.
 * @class
 */
export abstract class Recognizer {
    private disposed: boolean;

    protected audioConfig: AudioConfig;
    protected speechConfig: SpeechConfig;

    /**
     * Creates and initializes an instance of a Recognizer
     * @constructor
     * @param {AudioConfig} audioInput - An optional audio input stream associated with the recognizer
     */
    protected constructor(speechConfig: SpeechConfig, audioConfig: AudioConfig) {
        Contracts.throwIfNull(speechConfig as SpeechConfigImpl, "speechConfig");
        Contracts.throwIfNull(audioConfig, "audioConfig");

        this.audioConfig = audioConfig;
        const speechConfigImpl: SpeechConfigImpl = speechConfig as SpeechConfigImpl;

        this.speechConfig = speechConfigImpl.clone();

        this.disposed = false;
    }

    /**
     * Defines event handler for session events, e.g., SessionStartedEvent and SessionStoppedEvent.
     * @property
     */
    public SessionEvent: (sender: Recognizer, event: SessionEventArgs) => void;

    /**
     * Defines event handler for session events, e.g., SpeechStartDetectedEvent and SpeechEndDetectedEvent.
     * @property
     */
    public RecognitionEvent: (sender: Recognizer, event: RecognitionEventArgs) => void;

    /**
     * Dispose of associated resources.
     * @member
     */
    public close(): void {
        Contracts.throwIfDisposed(this.disposed);

        this.dispose(true);
    }

    /**
     * This method performs cleanup of resources.
     * The Boolean parameter disposing indicates whether the method is called from Dispose (if disposing is true) or from the finalizer (if disposing is false).
     * Derived classes should override this method to dispose resource if needed.
     * @member
     * @param {boolean} disposing - Flag to request disposal.
     */
    protected dispose(disposing: boolean): void {
        if (this.disposed) {
            return;
        }

        if (disposing) {
            // disconnect
        }

        this.disposed = true;
    }

    //
    // ################################################################################################################
    // IMPLEMENTATION.
    // Move to independent class
    // ################################################################################################################
    //

    protected abstract CreateRecognizerConfig(speecgConfig: PlatformConfig, recognitionMode: RecognitionMode): RecognizerConfig;

    protected abstract CreateServiceRecognizer(authentication: IAuthentication, connectionFactory: IConnectionFactory, audioConfig: AudioConfig, recognizerConfig: RecognizerConfig): ServiceRecognizerBase;

    // Setup the recognizer
    protected implRecognizerSetup(recognitionMode: RecognitionMode, speechConfig: SpeechConfig, audioConfig: AudioConfig, speechConnectionFactory: IConnectionFactory): ServiceRecognizerBase {

        const recognizerConfig = this.CreateRecognizerConfig(
            new PlatformConfig(
                new Context(
                    new OS("navigator.userAgent", "Browser", null),
                    new Device("SpeechSample", "SpeechSample", "1.0.00000"))), // TODO: Need to get these values from the caller?
            recognitionMode); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)
        const speechImlConfig: SpeechConfigImpl = speechConfig as SpeechConfigImpl;

        const subscriptionKey = speechConfig.getProperty(RecognizerParameterNames.SubscriptionKey, undefined);
        const authentication = subscriptionKey ?
            new CognitiveSubscriptionKeyAuthentication(subscriptionKey) :
            new CognitiveTokenAuthentication(
                (authFetchEventId: string): Promise<string> => {
                    const authorizationToken = speechConfig.getProperty(RecognizerParameterNames.AuthorizationToken, undefined);
                    return PromiseHelper.FromResult(authorizationToken);
                },
                (authFetchEventId: string): Promise<string> => {
                    const authorizationToken = speechConfig.getProperty(RecognizerParameterNames.AuthorizationToken, undefined);
                    return PromiseHelper.FromResult(authorizationToken);
                });

        return this.CreateServiceRecognizer(
            authentication,
            speechConnectionFactory,
            audioConfig,
            recognizerConfig);
    }

    // Start the recognition
    protected implRecognizerStart(recognizer: ServiceRecognizerBase, cb: (event: SpeechRecognitionEvent) => void): void {
        recognizer.Recognize((event: SpeechRecognitionEvent) => {
            if (this.disposed) {
                return;
            }

            let sessionEvent: SessionEventArgs;
            let recognitionEvent: RecognitionEventArgs;

            /*
                Alternative syntax for typescript devs.
                if (event instanceof SDK.RecognitionTriggeredEvent)
            */
            // TODO: The mapping of internal service events to API surface events is... bad. Needs to be cleaned up to have a common mapping
            // that's understandable.
            switch (event.Name) {
                case "RecognitionTriggeredEvent":
                case "ListeningStartedEvent":
                    // Internal events, ignore
                    break;

                case "RecognitionStartedEvent": // Fires when the client connects to the service successfuly.
                    sessionEvent = new SessionEventArgs();
                    sessionEvent.SessionId = event.SessionId;
                    sessionEvent.eventType = SessionEventType.SessionStartedEvent;

                    if (!!this.SessionEvent) {
                        this.SessionEvent(this, sessionEvent);
                    }
                    break;

                case "RecognitionEndedEvent":
                    const recoEndedEvent = event as RecognitionEndedEvent;

                    sessionEvent = new SessionEventArgs();
                    sessionEvent.SessionId = recoEndedEvent.SessionId;
                    sessionEvent.eventType = SessionEventType.SessionStoppedEvent;

                    if (recoEndedEvent.Status !== RecognitionCompletionStatus.Success) {
                        if (cb) {
                            cb(event); // call continuation, if configured.
                        }
                    }

                    if (!!this.SessionEvent) {
                        this.SessionEvent(this, sessionEvent);
                    }
                    break;

                case "SpeechStartDetectedEvent":
                    recognitionEvent = new RecognitionEventArgs();
                    recognitionEvent.sessionId = event.SessionId;
                    recognitionEvent.eventType = RecognitionEventType.SpeechStartDetectedEvent;
                    recognitionEvent.offset = 0; // TODO

                    if (!!this.RecognitionEvent) {
                        this.RecognitionEvent(this, recognitionEvent);
                    }
                    break;

                case "SpeechEndDetectedEvent":
                    recognitionEvent = new RecognitionEventArgs();
                    recognitionEvent.sessionId = event.SessionId;
                    recognitionEvent.eventType = RecognitionEventType.SpeechEndDetectedEvent;
                    recognitionEvent.offset = 0; // TODO

                    if (!!this.RecognitionEvent) {
                        this.RecognitionEvent(this, recognitionEvent);
                    }
                    break;

                default:
                    if (cb) {
                        cb(event); // call continuation, if configured.
                    }
            }
        });
    }
}