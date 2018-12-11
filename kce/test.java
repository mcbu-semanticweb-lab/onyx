import it.essepuntato.semanticweb.kce.engine.Engine;
import it.essepuntato.taxonomy.HTaxonomy;
import it.essepuntato.taxonomy.maker.OWLAPITaxonomyMaker;

import java.util.Set;


public class test {

  public static void main(String[] args){
    String ontologyURL = args[0];
    boolean considerImportedOntologies = true;
    HTaxonomy ht = new OWLAPITaxonomyMaker(ontologyURL, considerImportedOntologies).makeTaxonomy();
    Engine e = new Engine(ht);
    e.setSequence(true);
    e.run();
    Set result = e.getKeyConcepts();
    //System.out.println("Deneme");
    System.out.println(result);
  }

}
