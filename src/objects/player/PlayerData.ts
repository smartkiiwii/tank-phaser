export type PlayerData = {
    highscore: number;
    preferences: {
        mute: boolean;
    }
}

export function loadPlayerData(): PlayerData {
    const data = localStorage.getItem('playerData')
    if (data) {
        return JSON.parse(data)
    } else {
        return {
            highscore: 0,
            preferences: {
                mute: false,
            }
        }
    }
}

export function savePlayerData(data: PlayerData) {
    localStorage.setItem('playerData', JSON.stringify(data))
}

export function resetPlayerData() {
    localStorage.removeItem('playerData')
}

export const PlayerDataActions = {
    SET_HIGHSCORE: 'SET_HIGHSCORE',
    SET_MUTE: 'SET_MUTE',
} as const

export type PlayerDataActions = typeof PlayerDataActions[keyof typeof PlayerDataActions]

export function setPlayerData(action: PlayerDataActions, value: number | boolean) {
    const data = loadPlayerData()

    switch (action) {
        case PlayerDataActions.SET_HIGHSCORE:
            if (typeof value !== 'number') throw new Error('Invalid value for highscore')
            data.highscore = value
            break

        case PlayerDataActions.SET_MUTE:
            if (typeof value !== 'boolean') throw new Error('Invalid value for mute')
            data.preferences.mute = value
            break
    }

    savePlayerData(data)
}
