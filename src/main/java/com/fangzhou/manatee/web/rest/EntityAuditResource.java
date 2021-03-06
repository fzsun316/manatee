package com.fangzhou.manatee.web.rest;

import com.fangzhou.manatee.domain.EntityAuditEvent;
import com.fangzhou.manatee.repository.EntityAuditEventRepository;
import com.fangzhou.manatee.web.rest.util.PaginationUtil;
import com.fangzhou.manatee.security.AuthoritiesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.annotation.Secured;
import com.codahale.metrics.annotation.Timed;

import javax.inject.Inject;
import java.net.URISyntaxException;
import java.util.List;
import javax.transaction.Transactional;

import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.time.LocalDateTime;

/**
 * REST controller for getting the audit events for entity
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EntityAuditResource {

    private final Logger log = LoggerFactory.getLogger(EntityAuditResource.class);

    @Inject
    private EntityAuditEventRepository entityAuditEventRepository;

    /**
     * fetches all the audited entity types
     *
     * @return
     */
    @RequestMapping(value = "/audits/entity/all",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public List<String> getAuditedEntities() {
        return entityAuditEventRepository.findAllEntityTypes();
    }

    /**
     * fetches the last 100 change list for an entity class, if limit is passed fetches that many changes
     *
     * @return
     */
    @RequestMapping(value = "/audits/entity/changes",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<List<EntityAuditEvent>> getChanges(@RequestParam(value = "entityType") String entityType,
                                                             @RequestParam(value = "limit") int limit)
        throws URISyntaxException {
        log.debug("REST request to get a page of EntityAuditEvents");
        Pageable pageRequest = createPageRequest(limit);
        Page<EntityAuditEvent> page = entityAuditEventRepository.findAllByEntityType(entityType, pageRequest);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/audits/entity/changes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);

    }

    /**
     * fetches the change list for an entity class in the current day
     *
     * @return
     */
    @RequestMapping(value = "/audits/entity/changesSameDay",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public List<EntityAuditEvent> getChangesSameDay(@RequestParam(value = "entityType") String entityType)
        throws URISyntaxException {
        log.debug("REST request to get EntityAuditEvents of the current day");
        LocalDateTime localtDateAndTime = LocalDateTime.now();
        ZoneId zoneId = ZoneId.of("America/Chicago");
        ZonedDateTime datetimeInNashville  = ZonedDateTime.of(localtDateAndTime, zoneId);
        ZonedDateTime zdt = ZonedDateTime.of(datetimeInNashville.getYear(), datetimeInNashville.getMonthValue(), datetimeInNashville.getDayOfMonth(), 0, 0, 0, 0, zoneId);
        return entityAuditEventRepository.findAllByCurrentDay(zdt, entityType);

    }

    /**
     * fetches a previous version for for an entity class and id
     *
     * @return
     */
    @RequestMapping(value = "/audits/entity/changes/version/previous",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<EntityAuditEvent> getPrevVersion(@RequestParam(value = "qualifiedName") String qualifiedName,
                                                           @RequestParam(value = "entityId") Long entityId,
                                                           @RequestParam(value = "commitVersion") Integer commitVersion)
        throws URISyntaxException {
        EntityAuditEvent prev = entityAuditEventRepository.findOneByEntityTypeAndEntityIdAndCommitVersion(qualifiedName, entityId, commitVersion);
        return new ResponseEntity<>(prev, HttpStatus.OK);

    }

    /**
     * creates a page request object for PaginationUti
     *
     * @return
     */
    private Pageable createPageRequest(int size) {
        return new PageRequest(0, size);
    }

}
