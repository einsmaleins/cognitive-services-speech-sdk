//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
//

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Runtime.Serialization;

namespace Microsoft.CognitiveServices.Speech
{
    /// <summary>
    /// Collection of best recognitions.
    /// </summary>
    [DataContract]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Performance", "CA1812:Avoid uninstantiated internal classes", Justification = "<Pending>")]
    internal sealed class DetailedSpeechRecognitionResultCollection
    {
        /// <summary>
        /// Enumerable of alternative interpretations of the same speech recognition result.
        /// </summary>
        [DataMember]
        public IEnumerable<DetailedSpeechRecognitionResult> NBest { get; set; }
    }

    /// <summary>
    /// Detailed recognition result.
    /// Changed in version 1.7.0.
    /// </summary>
    [DataContract]
    public sealed class DetailedSpeechRecognitionResult
    {
        internal DetailedSpeechRecognitionResult()
        { }

        internal DetailedSpeechRecognitionResult(double confidence, string text, string lexicalForm, string normalizedForm)
        {
            this.Confidence = confidence;
            this.Text = text;
            this.LexicalForm = lexicalForm;
            this.NormalizedForm = normalizedForm;
            this.MaskedNormalizedForm = normalizedForm;
        }

        /// <summary>
        /// Confidence of recognition.
        /// </summary>
        [DataMember]
        public double Confidence { get; private set; }

        /// <summary>
        /// Recognized text.
        /// </summary>
        [DataMember(Name = "Display")]
        public string Text { get; private set; }

        /// <summary>
        /// Raw lexical form.
        /// </summary>
        [DataMember(Name = "Lexical")]
        public string LexicalForm { get; private set; }

        /// <summary>
        /// Normalized form.
        /// </summary>
        [DataMember(Name = "ITN")]
        public string NormalizedForm { get; private set; }

        /// <summary>
        /// Normalized form with masked profanity.
        /// </summary>
        [DataMember(Name = "MaskedITN")]
        public string MaskedNormalizedForm { get; private set; }

        /// <summary>
        /// Sentence level pronunciation assessment result, available when pronunciation assessment is enabled.
        /// Added in version 1.14.0
        /// </summary>
        [DataMember(Name = "PronunciationAssessment")]
        internal SentenceLevelPronunciationAssessmentResult PronunciationAssessment { get; private set; }

        /// <summary>
        /// Word level timing result list
        /// Added in version 1.7.0.
        /// </summary>
        [DataMember(Name = "Words")]
        public IEnumerable<WordLevelTimingResult> Words {get; private set;}
    }

    /// <summary>
    /// Word level timing result.
    /// Added in version 1.7.0.
    /// </summary>
    [DataContract]
    public sealed class WordLevelTimingResult
    {
        internal WordLevelTimingResult()
        { }

        internal WordLevelTimingResult(int duration, long offset, string word)
        {
            this.Duration = duration;
            this.Offset = offset;
            this.Word = word;
        }

        /// <summary>
        /// Duration in ticks.
        /// </summary>
        [DataMember]
        public int Duration { get; private set; }

        /// <summary>
        /// Offset in ticks.
        /// </summary>
        [DataMember]
        public long Offset { get; private set; }

        /// <summary>
        /// Recognized word.
        /// </summary>
        [DataMember]
        public string Word { get; private set; }

        /// <summary>
        /// Word level pronunciation assessment result, available when pronuncation assessment is enabled.
        /// Added in version 1.14.0
        /// </summary>
        [DataMember(Name = "PronunciationAssessment")]
        internal WordLevelPronunciationAssessmentResult PronunciationAssessment { get; private set; }

        /// <summary>
        /// Phoneme level timing result list.
        /// Added in version 1.14.0.
        /// </summary>
        [DataMember(Name = "Phonemes")]
        internal IEnumerable<PhonemeLevelTimingResult> Phonemes { get; private set; }
    }

    /// <summary>
    /// Phoneme level timing result.
    /// Added in version 1.14.0.
    /// </summary>
    [DataContract]
    internal sealed class PhonemeLevelTimingResult
    {
        internal PhonemeLevelTimingResult()
        { }

        /// <summary>
        /// Duration in ticks.
        /// </summary>
        [DataMember]
        public int Duration { get; private set; }

        /// <summary>
        /// Offset in ticks.
        /// </summary>
        [DataMember]
        public long Offset { get; private set; }

        /// <summary>
        /// Recognized Phoneme.
        /// </summary>
        [DataMember]
        public string Phoneme { get; private set; }

        /// <summary>
        /// Phoneme level pronunciation assessment result, available when pronuncation assessment is enabled.
        /// </summary>
        [DataMember(Name = "PronunciationAssessment")]
        public PhonemeLevelPronunciationAssessmentResult PronunciationAssessment { get; private set; }
    }

    /// <summary>
    /// Sentence level pronunciation assessment results
    /// Added in version 1.14.0.
    /// </summary>
    [DataContract]
    internal sealed class SentenceLevelPronunciationAssessmentResult 
    {
        internal SentenceLevelPronunciationAssessmentResult()
        { }

        /// <summary>
        /// Accuracy score.
        /// </summary>
        [DataMember]
        public double AccuracyScore { get; private set; }

        /// <summary>
        /// Pronunciation score.
        /// </summary>
        [DataMember(Name = "PronScore")]
        public double PronunciationScore { get; private set; }

        /// <summary>
        /// Completeness score.
        /// </summary>
        [DataMember]
        public double CompletenessScore { get; private set; }

        /// <summary>
        /// Fluency score.
        /// </summary>
        [DataMember]
        public double FluencyScore { get; private set; }
    }

    /// <summary>
    /// Word level pronunciation assessment results
    /// Added in version 1.14.0.
    /// </summary>
    [DataContract]
    internal sealed class WordLevelPronunciationAssessmentResult
    {
        internal WordLevelPronunciationAssessmentResult()
        { }

        /// <summary>
        /// Accuracy score.
        /// </summary>
        [DataMember]
        public double AccuracyScore { get; private set; }

        /// <summary>
        /// Error type.
        /// </summary>
        [DataMember]
        public string ErrorType { get; private set; }
    }

    /// <summary>
    /// Phoneme level pronunciation assessment results
    /// Added in version 1.14.0.
    /// </summary>
    [DataContract]
    internal sealed class PhonemeLevelPronunciationAssessmentResult
    {
        internal PhonemeLevelPronunciationAssessmentResult()
        { }

        /// <summary>
        /// Accuracy score.
        /// </summary>
        [DataMember]
        public double AccuracyScore { get; private set; }

    }
}
