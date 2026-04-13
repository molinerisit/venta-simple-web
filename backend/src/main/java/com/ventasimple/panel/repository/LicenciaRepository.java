package com.ventasimple.panel.repository;

import com.ventasimple.panel.model.Licencia;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface LicenciaRepository extends JpaRepository<Licencia, UUID> {
    Optional<Licencia> findByClave(String clave);
    List<Licencia> findByEstado(Licencia.Estado estado);
    List<Licencia> findByInstalacionId(UUID instalacionId);
}
