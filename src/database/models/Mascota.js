module.exports = (sequelize, dataTypes) => {
    let alias = 'Mascota';
    let cols = {
        idMascota: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idHumano: {
            type: dataTypes.STRING
        },
        nombre: {
            type: dataTypes.STRING
        },
        descripcion: {
            type: dataTypes.INTEGER
        },
        status: {
            type: dataTypes.STRING
        },
        fotoMascota: {
            type: dataTypes.BLOB('medium')
        },
        colorPrimario: {
            type: dataTypes.STRING
        },
        colorSecundario: {
            type: dataTypes.STRING
        },
        tipoMascota: {
            type: dataTypes.STRING
        },
        pesoAproximado: {
            type: dataTypes.STRING
        },
        latPerdida: {
            type: dataTypes.DECIMAL
        },
        lngPerdida: {
            type: dataTypes.DECIMAL
        },
        latEncontrada: {
            type: dataTypes.DECIMAL
        },
        lngEncontrada: {
            type: dataTypes.DECIMAL
        },
    };
    let config = {
        tableName: 'mascotas',
        timestamps: false
    };
    const Mascota = sequelize.define(alias, cols, config)

    return Mascota

}
