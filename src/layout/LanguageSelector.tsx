import * as React from "react";
import {withTranslation} from "react-i18next";

import i18n from "../i18n";
import {Button, Dropdown, FlagIcon} from "../reusable";

import Style from "./LanguageSelector.scss";

function languageToIcon(lang: string) {
    switch (lang) {
        case "en":
            return "gb";
        case "ru":
            return "ru";
        case "zh":
            return "cn";
        default:
            throw new Error(`Invalid language ${lang}`);
    }
}

function toLanguage(lang: string) {
    switch (lang) {
        case "en":
            return "English";
        case "ru":
            return "Pусский";
        case "zh":
            return "中国";
        default:
            throw new Error(`Invalid language ${lang}`);
    }
}

const LanguageIcon = ({lang}: {lang: string}) => <FlagIcon code={languageToIcon(lang)} />;

const LanguageSelector = () => {
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const button = (
        <button className={Style.flagButton}>
            {" "}
            <LanguageIcon lang={i18n.language} />
        </button>
    );

    return (
        <Dropdown button={button}>
            {Object.keys(i18n.services.resourceStore.data).map((val, idx) => (
                <Button key={idx} size="sm" variant="dropdown" onClick={() => changeLanguage(val)}>
                    <LanguageIcon lang={val} />
                    <span>{toLanguage(val)}</span>
                </Button>
            ))}
        </Dropdown>
    );
};

export default withTranslation()(LanguageSelector);
