SELECT
    M.createdAt,
    msj_contenido,
    msjIdPostPropuestaId,
    msjUserFromId,
    msjUserToId
FROM mensaje M
INNER JOIN usuario U ON(M.msjUserFromId=U.id)
WHERE U.id=1
UNION
SELECT
    M.createdAt,
    msj_contenido,
    msjIdPostPropuestaId,
    msjUserFromId,
    msjUserToId
FROM mensaje M
    INNER JOIN usuario U ON(M.msjUserToId=U.id)
WHERE U.id=1
ORDER BY 1 DESC;
