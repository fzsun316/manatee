package com.fangzhou.manatee.repository;

import com.fangzhou.manatee.domain.EntityAuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.time.ZonedDateTime;

/**
 * Spring Data JPA repository for the EntityAuditEvent entity.
 */
public interface EntityAuditEventRepository extends JpaRepository<EntityAuditEvent, Long> {

    List<EntityAuditEvent> findAllByEntityTypeAndEntityId(String entityType, Long entityId);

    @Query("SELECT max(a.commitVersion) FROM EntityAuditEvent a where a.entityType = :type and a.entityId = :entityId")
    Integer findMaxCommitVersion(@Param("type") String type, @Param("entityId") Long entityId);

    @Query("SELECT DISTINCT (a.entityType) from EntityAuditEvent a")
    List<String> findAllEntityTypes();

    Page<EntityAuditEvent> findAllByEntityType(String entityType, Pageable pageRequest);

    // manatee code
    @Query("SELECT a FROM EntityAuditEvent a where a.entityType = :type and a.modifiedDate > :modifiedDate")
    List<EntityAuditEvent> findAllByCurrentDay(@Param("modifiedDate") ZonedDateTime modifiedDate, @Param("type") String type);



    @Query("SELECT ae FROM EntityAuditEvent ae where ae.entityType = :type and ae.entityId = :entityId and " +
        "ae.commitVersion =(SELECT max(a.commitVersion) FROM EntityAuditEvent a where a.entityType = :type and " +
        "a.entityId = :entityId and a.commitVersion < :commitVersion)")
    EntityAuditEvent findOneByEntityTypeAndEntityIdAndCommitVersion(@Param("type") String type, @Param("entityId")
    Long entityId, @Param("commitVersion") Integer commitVersion);
}
