import { async } from "regenerator-runtime";
import { TIMEOUT_SECONDS } from "./config.js";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            );
        }, s * 1000);
    });
};

export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchPromise = uploadData
            ? fetch(url, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(uploadData),
              })
            : fetch(url);

        const response = await Promise.race([
            fetchPromise,
            timeout(TIMEOUT_SECONDS),
        ]);
        const data = await response.json();

        if (!response.ok)
            throw new Error(`${data.message} (${response.status})`);

        return data;
    } catch (error) {
        throw error;
    }
};

/**
 *
 * @param {String} input The string to be checked
 * @param {Number|} range The expected number of items which seperated by comma
 * @returns {undefined | Object[]} undefined is returned if any given parameters are invalid
 */
export const getCommaseparatedFor = function (input, range) {
    if (typeof input !== "string" || range <= 0) return;

    const splitted = input.split(",").map((element) => element.trim());

    if (splitted.length !== range) return;

    return splitted;
};

/*
export const getJSON = async function (url) {
    try {
        const fetchPromise = fetch(url);
        const response = await Promise.race([
            fetchPromise,
            timeout(TIMEOUT_SECONDS),
        ]);
        const data = await response.json();

        if (!response.ok)
            throw new Error(`${data.message} (${response.status})`);

        return data;
    } catch (error) {
        throw error;
    }
};

export const sendJSON = async function (url, dataToSend) {
    try {
        const fetchPromise = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        const response = await Promise.race([
            fetchPromise,
            timeout(TIMEOUT_SECONDS),
        ]);
        const data = await response.json();

        if (!response.ok)
            throw new Error(`${data.message} (${response.status})`);

        return data;
    } catch (error) {
        throw error;
    }
};*/
