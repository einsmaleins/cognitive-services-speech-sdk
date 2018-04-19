package com.microsoft.cognitiveservices.speech.recognition.translation;

import java.util.HashMap;
import java.util.Map;

import com.microsoft.cognitiveservices.speech.recognition.RecognitionStatus;

//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
//

/// <summary>
/// Defines tranlsation result.
/// </summary>
public class TranslationTextResult extends com.microsoft.cognitiveservices.speech.recognition.speech.SpeechRecognitionResult
{
    // BUG: this is hack for making documentation going.
    public TranslationTextResult(com.microsoft.cognitiveservices.speech.internal.TranslationTextResult result)
    {
        super(null);
        
        // @TODO why?
        _TranslationStatus = RecognitionStatus.Canceled;
        _Translations = new HashMap<String, String>();
    }

    TranslationTextResult(TranslationTextResult result) {
        super(null);
        // @TODO why?
        _TranslationStatus = RecognitionStatus.Canceled;
        _Translations = new HashMap<String, String>();
    }

    /// <summary>
    /// Specifies translation status.
    /// </summary>
    public final RecognitionStatus getTranslationStatus()
    {
        return _TranslationStatus;
    }// { get; }
    private RecognitionStatus _TranslationStatus;

    /// <summary>
    /// Presents the translation results. Each item in the dictionary represents translation result in one of target languages, where the key 
    /// is the name of the target language, in BCP-47 format, and the value is the translation text in the specified language.
    /// </summary>
    public final Map<String, String> getTranslations(){
        return _Translations;
    }// { get; }
    private Map<String, String> _Translations;
    
    /// <summary>
    /// Returns a String that represents the speech recognition result.
    /// </summary>
    /// <returns>A String that represents the speech recognition result.</returns>
    @Override
    public String toString()
    {
        return "Translations<<>>";
    }
}