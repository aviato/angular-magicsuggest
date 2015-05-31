/**
* Since this project uses an extended version of MagicSuggest, here's the Definitions file for the extension
*/

/**
* Service that defines configuration types for magic suggest.
*/
interface IMSSetupService {
    /*
    * Overrides the default configuration with a new one. 
    * This default configuration object is combined with the types
    * defined with pushConfig
    */
    pushDefaultConfig(newDefaultConfig: MagicSuggest.Configuration): void;
    /*
    * Addes a new configuration object associated with an identifier.
    * You can then use it in the type="" attribute of magic-suggest directive
    */
    pushConfig(indetifier: string, config: MagicSuggest.Configuration): void;
    /*
    * Gets a configuration object from an identifier. Used internally by 
    * magic-suggest directive.
    */
    getConfig(identifier: string): MagicSuggest.Configuration;
}

declare module MagicSuggest {
    /**
    * Configuration file customized by Leonardo Chaia
    */
    interface Configuration {
        /**
        * Renderer to be used when waiting for ajax response. Signature: () : string
        */
        loadingImageRenderer?: () => string;
        /**
        * Size of the dropdown when loading.
        */
        loadingImageSize?: number;
        /**
        * Determines whether the dropdown closes automatically after item selection.
        */
        closeOnSelect?: boolean;
        /**
        * Renderer to be used when there are no more results to show and allowFreeEntries is true. This will be rendered inside the combobox
        * Signature: (allowFreeEntries : boolean) : string
        */
        newEntryRenderer?: () => string;
        /**
        * Size of the dropdown when no more results.
        */
        newEntryHeight?: number;
        /**
        * Text to be used when there're no more results and allowFreeEntries is true. (Top right)
        */
        newEntryText?: string;
        /**
            * Determines whetherthe initial ajax call is executed or not. False by default.
            */
        doInitialAjaxCall?: boolean;
    }
}
